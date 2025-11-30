CREATE OR REPLACE VIEW "Nomination_results" AS
WITH prev AS (
  SELECT
    EXTRACT(YEAR  FROM (date_trunc('month', now()) - interval '1 month'))::int  AS year,
    EXTRACT(MONTH FROM (date_trunc('month', now()) - interval '1 month'))::int  AS month
)
SELECT
  nt.id  AS nomination_type_id,
  nt.type AS nomination_type,
  nv.year,
  nv.month,
  CASE WHEN nv.author_id IS NOT NULL THEN 'author' ELSE 'release' END AS entity_kind,
  nv.author_id,
  nv.release_id,
  COUNT(*)::int AS votes
FROM "Nomination_votes" nv
JOIN "Nomination_types" nt ON nt.id = nv.nomination_type_id
CROSS JOIN prev p
WHERE NOT (nv.year = p.year AND nv.month = p.month)
GROUP BY nt.id, nt.type, nv.year, nv.month, nv.author_id, nv.release_id;


CREATE OR REPLACE VIEW "Nomination_winners_single" AS
WITH ranked AS (
  SELECT
    r.nomination_type_id,
    r.nomination_type,
    r.year,
    r.month,
    r.entity_kind,
    r.author_id,
    r.release_id,
    r.votes,
    ROW_NUMBER() OVER (
      PARTITION BY r.nomination_type_id, r.year, r.month
      ORDER BY r.votes DESC, COALESCE(r.author_id, r.release_id) ASC
    ) AS rn
  FROM "Nomination_results" r
)
SELECT
  nomination_type_id,
  nomination_type,
  year,
  month,
  entity_kind,
  author_id,
  release_id,
  votes
FROM ranked
WHERE rn = 1;


CREATE OR REPLACE VIEW "Nomination_winners_enriched" AS
WITH w AS (
    SELECT
        r.nomination_type_id,
        r.nomination_type,
        r.year,
        r.month,
        r.entity_kind,
        r.author_id,
        r.release_id,
        r.votes
    FROM "Nomination_winners_single" r
)
SELECT
    w.nomination_type_id,
    w.nomination_type,
    w.year,
    w.month,
    w.entity_kind,

    COALESCE(w.author_id, w.release_id) AS entity_id,

    a.id   AS author_id,
    a.name AS author_name,
    a.avatar_img AS author_avatar_img,
    a.cover_img  AS author_cover_img,

    rel.id    AS release_id,
    rel.title AS release_title,
    rel.img   AS release_img,

    CASE
        WHEN w.entity_kind = 'release' THEN COALESCE(rel_arstists.authors, ARRAY[]::text[])
        ELSE ARRAY[]::text[]
    END AS release_artists,

    CASE
        WHEN w.entity_kind = 'release' THEN COALESCE(rel_producers.authors, ARRAY[]::text[])
        ELSE ARRAY[]::text[]
    END AS release_producers,

    CASE
        WHEN w.entity_kind = 'release' THEN COALESCE(rel_designers.authors, ARRAY[]::text[])
        ELSE ARRAY[]::text[]
    END AS release_designers,

    w.votes
FROM w
    LEFT JOIN "Authors" a ON a.id  = w.author_id
    LEFT JOIN "Releases" rel ON rel.id = w.release_id
    LEFT JOIN LATERAL (
    SELECT ARRAY(
            SELECT DISTINCT aut.name
            FROM (
                SELECT ra.author_id
                FROM "Release_artists" ra
                WHERE ra.release_id = rel.id
            ) u
            JOIN "Authors" aut ON aut.id = u.author_id
            ORDER BY aut.name
        )::text[] AS authors
    ) rel_arstists ON TRUE
    LEFT JOIN LATERAL (
    SELECT ARRAY(
                   SELECT DISTINCT aut.name
                   FROM (
                            SELECT rp.author_id
                            FROM "Release_producers" rp
                            WHERE rp.release_id = rel.id
                        ) u
                            JOIN "Authors" aut ON aut.id = u.author_id
                   ORDER BY aut.name
           )::text[] AS authors
    ) rel_producers ON TRUE
    LEFT JOIN LATERAL (
    SELECT ARRAY(
                   SELECT DISTINCT aut.name
                   FROM (
                            SELECT rd.author_id
                            FROM "Release_designers" rd
                            WHERE rd.release_id = rel.id
                        ) u
                            JOIN "Authors" aut ON aut.id = u.author_id
                   ORDER BY aut.name
           )::text[] AS authors
    ) rel_designers ON TRUE;


CREATE OR REPLACE VIEW "Nomination_winners_monthly_json" AS
WITH base AS (
    SELECT
        nomination_type,
        year,
        month,
        entity_kind,
        entity_id,
        votes,
        author_id,
        author_name,
        author_avatar_img,
        author_cover_img,
        release_id,
        release_title,
        release_img,
        release_artists,
        release_producers,
        release_designers
    FROM "Nomination_winners_enriched"
)
SELECT
    year,
    month,
    json_agg(
            jsonb_build_object(
                    'type', nomination_type,
                    'entityKind', entity_kind,
                    'entityId',   entity_id,
                    'votes',      votes
            )
                || CASE WHEN entity_kind = 'author' THEN jsonb_build_object(
                    'author', jsonb_build_object(
                            'id',        author_id,
                            'name',      author_name,
                            'avatarImg', author_avatar_img,
                            'coverImg',  author_cover_img
                )
                ) ELSE '{}'::jsonb END
                || CASE WHEN entity_kind = 'release' THEN jsonb_build_object(
                    'release', jsonb_build_object(
                            'id',      release_id,
                            'title',   release_title,
                            'img',     release_img,
                            'artists', COALESCE(to_jsonb(release_artists), '[]'::jsonb),
                            'producers', COALESCE(to_jsonb(release_producers), '[]'::jsonb),
                            'designers', COALESCE(to_jsonb(release_designers), '[]'::jsonb)
                )
            ) ELSE '{}'::jsonb END
            ORDER BY nomination_type
    ) AS results
FROM base
GROUP BY year, month
ORDER BY year, month;


CREATE OR REPLACE VIEW "Nomination_winner_participations" AS
WITH w AS (
    SELECT
        r.nomination_type_id,
        r.nomination_type,
        r.year,
        r.month,
        r.entity_kind,
        r.author_id,
        r.release_id,
        r.votes
    FROM "Nomination_winners_single" r
),

     release_participants AS (
         SELECT
             w.nomination_type_id,
             w.nomination_type,
             w.year,
             w.month,
             w.entity_kind,
             w.author_id,
             w.release_id,
             w.votes,
             rr.author_id AS participant_author_id,
             rr.role
         FROM w
            JOIN LATERAL (
                SELECT ra.author_id, 'artist'::text AS role
                FROM "Release_artists" ra
                WHERE ra.release_id = w.release_id
                UNION ALL
                SELECT rp.author_id, 'producer'::text AS role
                FROM "Release_producers" rp
                WHERE rp.release_id = w.release_id
                UNION ALL
                SELECT rd.author_id, 'designer'::text AS role
                FROM "Release_designers" rd
                WHERE rd.release_id = w.release_id
            ) rr ON TRUE
         WHERE w.entity_kind = 'release'
     ),

     release_participants_agg AS (
         SELECT
             nomination_type_id,
             nomination_type,
             year,
             month,
             'release'::text AS entity_kind,
             NULL::text AS author_id,
             release_id,
             votes,
             participant_author_id
         FROM release_participants
         GROUP BY nomination_type_id, nomination_type, year, month, release_id, votes, participant_author_id
     ),

     author_participants AS (
         SELECT
             w.nomination_type_id,
             w.nomination_type,
             w.year,
             w.month,
             'author'::text AS entity_kind,
             w.author_id,
             NULL::text     AS release_id,
             w.votes,
             w.author_id    AS participant_author_id
         FROM w
         WHERE w.entity_kind = 'author'
    )
SELECT * FROM author_participants
UNION ALL
SELECT * FROM release_participants_agg;


CREATE OR REPLACE VIEW "Nomination_winner_participations_enriched" AS
WITH e AS (
    SELECT
        ne.nomination_type_id,
        ne.nomination_type,
        ne.year,
        ne.month,
        ne.entity_kind,
        ne.entity_id,
        ne.author_id,
        ne.author_name,
        ne.author_avatar_img,
        ne.author_cover_img,
        ne.release_id,
        ne.release_title,
        ne.release_img,
        ne.release_artists,
        ne.release_producers,
        ne.release_designers,
        ne.votes
    FROM "Nomination_winners_enriched" ne
),
     p AS (
         SELECT
             nomination_type_id,
             nomination_type,
             year,
             month,
             entity_kind,
             author_id,
             release_id,
             votes,
             participant_author_id
         FROM "Nomination_winner_participations"
     )
SELECT
    e.nomination_type_id,
    e.nomination_type,
    e.year,
    e.month,
    e.entity_kind,
    e.entity_id,

    e.author_id         AS winner_author_id,
    e.author_name       AS winner_author_name,
    e.author_avatar_img AS winner_author_avatar_img,
    e.author_cover_img  AS winner_author_cover_img,

    e.release_id        AS winner_release_id,
    e.release_title     AS winner_release_title,
    e.release_img       AS winner_release_img,

    e.release_artists,
    e.release_producers,
    e.release_designers,

    p.participant_author_id,

    e.votes
FROM e
    JOIN p ON p.nomination_type_id = e.nomination_type_id
                AND p.year = e.year
                AND p.month = e.month
                AND p.entity_kind = e.entity_kind
                AND p.author_id IS NOT DISTINCT FROM e.author_id
                AND p.release_id IS NOT DISTINCT FROM e.release_id;


CREATE OR REPLACE VIEW "Nomination_winner_participations_enriched_json" AS
WITH base AS (
  SELECT
    nomination_type_id,
    nomination_type,
    year,
    month,
    entity_kind,
    entity_id,
    winner_author_id,
    winner_author_name,
    winner_author_avatar_img,
    winner_author_cover_img,
    winner_release_id,
    winner_release_title,
    winner_release_img,
    release_artists,
    release_producers,
    release_designers,
    participant_author_id,
    votes
  FROM "Nomination_winner_participations_enriched"
)
SELECT
  participant_author_id AS "authorId",
  json_agg(
    jsonb_build_object(
      'nominationTypeId', nomination_type_id,
      'nominationType',   nomination_type,
      'year',             year,
      'month',            month,
      'entityKind',       entity_kind,
      'entityId',         entity_id,
      'votes',            votes
    )
    || CASE
         WHEN entity_kind = 'author' THEN jsonb_build_object(
           'author', jsonb_build_object(
             'id',        winner_author_id,
             'name',      winner_author_name,
             'avatarImg', winner_author_avatar_img,
             'coverImg',  winner_author_cover_img
           )
         )
         ELSE '{}'::jsonb
       END
    || CASE
         WHEN entity_kind = 'release' THEN jsonb_build_object(
           'release', jsonb_build_object(
             'id',        winner_release_id,
             'title',     winner_release_title,
             'img',       winner_release_img,
             'artists',   COALESCE(to_jsonb(release_artists),   '[]'::jsonb),
             'producers', COALESCE(to_jsonb(release_producers), '[]'::jsonb),
             'designers', COALESCE(to_jsonb(release_designers), '[]'::jsonb)
           )
         )
         ELSE '{}'::jsonb
       END
    ORDER BY year, month, nomination_type
  ) AS "nominations"
FROM base
GROUP BY participant_author_id;


CREATE OR REPLACE VIEW platform_counters_summary AS
SELECT
    (
        SELECT COUNT(*)
        FROM "Users"
    )::int AS "totalUsers",

    (
        SELECT COUNT(DISTINCT ra.user_id)
        FROM "Registered_authors" ra
    )::int AS "registeredAuthors",

    (
        COALESCE((
            SELECT COUNT(*)
            FROM "User_fav_reviews" ufr
            JOIN "Reviews" rev ON rev.id = ufr.review_id
            WHERE EXISTS (
                SELECT 1
                FROM "Registered_authors" ra
                WHERE ra.user_id = ufr.user_id
                        AND ra.author_id IN (
                            SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = rev.release_id
                            UNION
                            SELECT ar.author_id FROM "Release_artists" ar WHERE ar.release_id = rev.release_id
                            UNION
                            SELECT rd.author_id FROM "Release_designers" rd WHERE rd.release_id = rev.release_id
                        )
            )
        ), 0)
            +
        COALESCE((
            SELECT COUNT(*)
                FROM "User_fav_media" ufm
                JOIN "Release_media" rm ON rm.id = ufm.media_id
                WHERE EXISTS (
                    SELECT 1
                    FROM "Registered_authors" ra
                    WHERE ra.user_id = ufm.user_id
                        AND ra.author_id IN (
                            SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = rm.release_id
                            UNION
                            SELECT ar.author_id FROM "Release_artists" ar WHERE ar.release_id = rm.release_id
                            UNION
                            SELECT rd.author_id FROM "Release_designers" rd WHERE rd.release_id = rm.release_id
                        )
                )
        ), 0)
    )::int AS "authorLikes",

    (
        SELECT COUNT(*)
        FROM "Author_comments" ac
        WHERE EXISTS (
            SELECT 1
            FROM "Registered_authors" ra
            WHERE ra.user_id = ac.user_id
              AND ra.author_id IN (
                SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = ac.release_id
                UNION
                SELECT ar.author_id FROM "Release_artists" ar WHERE ar.release_id = ac.release_id
                UNION
                SELECT rd.author_id FROM "Release_designers" rd WHERE rd.release_id = ac.release_id
            )
        )
    )::int AS "authorComments",

    (
        SELECT COUNT(*)
        FROM "Releases" r
        JOIN "Release_types" rt ON r.release_type_id = rt.id
        WHERE rt.type = 'Трек'
    )::int AS "totalTracks",

    (
        SELECT COUNT(*)
        FROM "Releases" r
        JOIN "Release_types" rt ON r.release_type_id = rt.id
        WHERE rt.type = 'Альбом'
    )::int AS "totalAlbums",

    (
        SELECT COUNT(*)
        FROM "Release_media" rm
        WHERE rm.user_id IS NOT NULL
    )::int AS "mediaReviews",

    (
        SELECT COUNT(*)
        FROM "Reviews" rev
        WHERE rev.text IS NOT NULL
    )::int AS "reviews",

    (
        SELECT COUNT(*)
        FROM "Release_ratings" rr
        JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
        WHERE rrt.type = 'Оценка без рецензии'
    )::int AS "withoutTextRatings"
;