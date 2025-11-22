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


CREATE OR REPLACE VIEW release_summary AS
SELECT
    r.id,
    r.title,
    EXTRACT(YEAR FROM r.publish_date) AS year,
    r.img,
    rt.type AS "releaseType",
    COALESCE(
            (
                SELECT
                    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                            'id', a.id,
                            'name', a.name,
                            'img', a.avatar_img
                                      ))
                FROM "Release_artists" ra
                         JOIN "Authors" a ON ra.author_id = a.id
                WHERE ra.release_id = r.id
            ),
            '[]'::json
    ) AS artists,
    COALESCE(
            (
                SELECT
                    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                            'id', a.id,
                            'name', a.name,
                            'img', a.avatar_img
                                      ))
                FROM "Release_producers" rp
                         JOIN "Authors" a ON rp.author_id = a.id
                WHERE rp.release_id = r.id
            ),
            '[]'::json
    ) AS producers,
    COALESCE(
            (
                SELECT
                    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                            'id', a.id,
                            'name', a.name,
                            'img', a.avatar_img
                                      ))
                FROM "Release_designers" rd
                         JOIN "Authors" a ON rd.author_id = a.id
                WHERE rd.release_id = r.id
            ),
            '[]'::json
    ) AS designers,
    COUNT(DISTINCT ufr.user_id)::int AS "favCount",
    CASE
        WHEN count(ufr.user_id) = 0 THEN '[]'::json
        ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                'userId', ufr.user_id,
                'releaseId', ufr.release_id
                               ))
        END AS "userFavRelease",
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'type', rrt.type,
            'total', rr.total
                      )) AS ratings,
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'type', rrt.type,
            'details', JSONB_BUILD_OBJECT(
                    'rhymes', rrd.rhymes,
                    'structure', rrd.structure,
                    'atmosphere', rrd.atmosphere,
                    'realization', rrd.realization,
                    'individuality', rrd.individuality
                       )
                      )) AS "ratingDetails",

    COALESCE((
            SELECT JSON_AGG(nr.nomination_type ORDER BY nr.nomination_type)
            FROM (
                    SELECT DISTINCT rres.nomination_type
                    FROM "Nomination_results" rres
                        JOIN (
                            SELECT nomination_type_id, year, month, SUM(votes) AS total_votes
                            FROM "Nomination_results"
                            GROUP BY nomination_type_id, year, month
                    ) bt
                        ON bt.nomination_type_id = rres.nomination_type_id
                            AND bt.year = rres.year
                            AND bt.month = rres.month
            WHERE rres.entity_kind = 'release'
                AND rres.release_id = r.id
                AND bt.total_votes > 0
                AND (rres.votes::numeric / bt.total_votes::numeric) > 0.2
            ) nr
    ), '[]'::json) AS "nominationTypes"

FROM "Releases" r
         LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
         LEFT JOIN "User_fav_releases" ufr ON r.id = ufr.release_id
         LEFT JOIN "Release_ratings" rr ON r.id = rr.release_id
         LEFT JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
         LEFT JOIN "Release_rating_details" rrd ON rr.id = rrd.release_rating_id
GROUP BY r.id, rt.type;


CREATE OR REPLACE VIEW user_profile_summary AS
SELECT
    u.id,
    u.nickname,
    TO_CHAR(u.created_at, 'DD.MM.YYYY') AS "createdAt",
    up.bio,
    up.avatar,
    up.cover_image AS cover,
    up.points,
    tul.rank AS position,
    rol.role,
    (COUNT(DISTINCT r.id) FILTER (WHERE r.text IS NOT NULL))::int AS "textCount",
    (COUNT(DISTINCT r.id) FILTER (WHERE r.text IS NULL))::int AS "withoutTextCount",

    (
      COALESCE((
        SELECT COUNT(*)
        FROM "User_fav_reviews" ufr
        JOIN "Reviews" rev ON ufr.review_id = rev.id
        WHERE rev.user_id = u.id
      ), 0)
      +
      COALESCE((
        SELECT COUNT(*)
        FROM "User_fav_media" ufm
        JOIN "Release_media" rm ON rm.id = ufm.media_id
        WHERE rm.user_id = u.id
      ), 0)
    )::int AS "receivedLikes",

    (
      COALESCE((
        SELECT COUNT(*)
        FROM "User_fav_reviews" ufr
        JOIN "Reviews" rev ON ufr.review_id = rev.id
        WHERE ufr.user_id = u.id AND rev.user_id != u.id
      ), 0)
      +
      COALESCE((
        SELECT COUNT(*)
        FROM "User_fav_media" ufm
        JOIN "Release_media" rm ON rm.id = ufm.media_id
        WHERE ufm.user_id = u.id AND rm.user_id != u.id
      ), 0)
    )::int AS "givenLikes",

    (
        COALESCE((
            SELECT COUNT(*)
                FROM "User_fav_reviews" ufr
                JOIN "Reviews" rev ON rev.id = ufr.review_id
                WHERE rev.user_id = u.id
                    AND EXISTS (
                         SELECT 1
                         FROM "Registered_authors" ra
                         WHERE ra.user_id = ufr.user_id
                           AND ra.author_id IN (
                             SELECT rp.author_id
                             FROM "Release_producers" rp
                             WHERE rp.release_id = rev.release_id
                             UNION
                             SELECT ar.author_id
                             FROM "Release_artists" ar
                             WHERE ar.release_id = rev.release_id
                             UNION
                             SELECT rd.author_id
                             FROM "Release_designers" rd
                             WHERE rd.release_id = rev.release_id
                           )
                    )
        ), 0)
        +
        COALESCE((
            SELECT COUNT(*)
                FROM "User_fav_media" ufm
                JOIN "Release_media" rm ON rm.id = ufm.media_id
                WHERE rm.user_id = u.id
                    AND EXISTS (
                         SELECT 1
                         FROM "Registered_authors" ra
                         WHERE ra.user_id = ufm.user_id
                           AND ra.author_id IN (
                             SELECT rp.author_id
                             FROM "Release_producers" rp
                             WHERE rp.release_id = rm.release_id
                             UNION
                             SELECT ar.author_id
                             FROM "Release_artists" ar
                             WHERE ar.release_id = rm.release_id
                             UNION
                             SELECT rd.author_id
                             FROM "Release_designers" rd
                             WHERE rd.release_id = rm.release_id
                         )
                    )
        ), 0)
    )::int AS "receivedAuthorLikes",

    (
        COALESCE((
            SELECT COUNT(*)
                FROM "User_fav_reviews" ufr
                JOIN "Reviews" rev ON rev.id = ufr.review_id
                WHERE ufr.user_id = u.id
                    AND rev.user_id != u.id
                    AND EXISTS (
                         SELECT 1
                         FROM "Registered_authors" ra
                         WHERE ra.user_id = u.id
                           AND ra.author_id IN (
                             SELECT rp.author_id
                             FROM "Release_producers" rp
                             WHERE rp.release_id = rev.release_id
                             UNION
                             SELECT ar.author_id
                             FROM "Release_artists" ar
                             WHERE ar.release_id = rev.release_id
                             UNION
                             SELECT rd.author_id
                             FROM "Release_designers" rd
                             WHERE rd.release_id = rev.release_id
                         )
                    )
        ), 0)
        +
        COALESCE((
            SELECT COUNT(*)
            FROM "User_fav_media" ufm
            JOIN "Release_media" rm ON rm.id = ufm.media_id
            WHERE ufm.user_id = u.id
                AND rm.user_id != u.id
                AND EXISTS (
                         SELECT 1
                         FROM "Registered_authors" ra
                         WHERE ra.user_id = u.id
                           AND ra.author_id IN (
                             SELECT rp.author_id
                             FROM "Release_producers" rp
                             WHERE rp.release_id = rm.release_id
                             UNION
                             SELECT ar.author_id
                             FROM "Release_artists" ar
                             WHERE ar.release_id = rm.release_id
                             UNION
                             SELECT rd.author_id
                             FROM "Release_designers" rd
                             WHERE rd.release_id = rm.release_id
                         )
                     )
        ), 0)
    )::int AS "givenAuthorLikes",

    CASE
        WHEN COUNT(sm.id) = 0 THEN '[]'::json
        ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                'id', sm.id,
                'name', sm.name,
                'url', psm.url
        ))
    END AS social,

    EXISTS(
        SELECT 1 FROM "Registered_authors" ra WHERE ra.user_id = u.id
    ) AS "isAuthor",

    COALESCE(
            (
                SELECT JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                        'id', at.id,
                        'type', at.type
                ))
                FROM "Registered_authors" ra
                    JOIN "Authors" a ON ra.author_id = a.id
                    JOIN "Authors_on_types" aot ON a.id = aot.author_id
                    JOIN "Author_types" at ON aot.author_type_id = at.id
                WHERE ra.user_id = u.id
            ),
            '[]'::json
    ) AS "authorTypes",

    (
        SELECT COUNT(DISTINCT ac.id)::int
        FROM "Author_comments" ac
        WHERE ac.user_id = u.id
    ) AS "authorCommentsCount"

FROM "User_profiles" up
    JOIN "Users" u ON up.user_id = u.id
    LEFT JOIN "Top_users_leaderboard" tul ON up.user_id = tul.user_id
    LEFT JOIN "Reviews" r ON u.id = r.user_id
    LEFT JOIN "Profile_social_media" psm ON up.id = psm.profile_id
    LEFT JOIN "Social_media" sm ON psm.social_id = sm.id
    LEFT JOIN "Roles" rol ON u.role_id = rol.id
GROUP BY u.id, u.nickname, u.created_at, up.bio, up.avatar, up.cover_image, up.points, tul.rank, rol.role;


CREATE OR REPLACE VIEW leaderboard_summary AS
SELECT
    tul.user_id as "userId",
    tul.rank,
    up.points,
    u.nickname,
    up.avatar,
    up.cover_image as cover,
    (COUNT(DISTINCT r.id) FILTER (WHERE r.text IS NOT NULL))::int AS "textCount",
    (COUNT(DISTINCT r.id) FILTER (WHERE r.text IS NULL))::int AS "withoutTextCount",

    (
      COALESCE((
        SELECT COUNT(*)
        FROM "User_fav_reviews" ufr
        JOIN "Reviews" rev ON ufr.review_id = rev.id
        WHERE rev.user_id = tul.user_id
      ), 0)
      +
      COALESCE((
        SELECT COUNT(*)
        FROM "User_fav_media" ufm
        JOIN "Release_media" rm ON rm.id = ufm.media_id
        WHERE rm.user_id = tul.user_id
      ), 0)
    )::int AS "receivedLikes",

    (
      COALESCE((
        SELECT COUNT(*)
        FROM "User_fav_reviews" ufr
        JOIN "Reviews" rev ON ufr.review_id = rev.id
        WHERE ufr.user_id = tul.user_id AND rev.user_id != tul.user_id
      ), 0)
      +
      COALESCE((
        SELECT COUNT(*)
        FROM "User_fav_media" ufm
        JOIN "Release_media" rm ON rm.id = ufm.media_id
        WHERE ufm.user_id = tul.user_id AND rm.user_id != tul.user_id
      ), 0)
    )::int AS "givenLikes",

    (
        COALESCE((
            SELECT COUNT(*)
                FROM "User_fav_reviews" ufr
                JOIN "Reviews" rev ON rev.id = ufr.review_id
                WHERE rev.user_id = tul.user_id
                    AND EXISTS (
                         SELECT 1
                         FROM "Registered_authors" ra
                         WHERE ra.user_id = ufr.user_id
                           AND ra.author_id IN (
                             SELECT rp.author_id 
                             FROM "Release_producers" rp 
                             WHERE rp.release_id = rev.release_id
                             UNION
                             SELECT ar.author_id 
                             FROM "Release_artists" ar 
                             WHERE ar.release_id = rev.release_id
                             UNION
                             SELECT rd.author_id 
                             FROM "Release_designers" rd 
                             WHERE rd.release_id = rev.release_id
                         )
                     )
            ), 0)
        +
        COALESCE((
            SELECT COUNT(*)
                FROM "User_fav_media" ufm
                JOIN "Release_media" rm ON rm.id = ufm.media_id
                WHERE rm.user_id = tul.user_id
                    AND EXISTS (
                         SELECT 1
                         FROM "Registered_authors" ra
                         WHERE ra.user_id = ufm.user_id
                           AND ra.author_id IN (
                             SELECT rp.author_id
                             FROM "Release_producers" rp
                             WHERE rp.release_id = rm.release_id
                             UNION
                             SELECT ar.author_id
                             FROM "Release_artists" ar
                             WHERE ar.release_id = rm.release_id
                             UNION
                             SELECT rd.author_id
                             FROM "Release_designers" rd
                             WHERE rd.release_id = rm.release_id
                         )
                     )
            ), 0)
        )::int AS "receivedAuthorLikes",

    (
        SELECT
            COALESCE(
                json_agg(
                    jsonb_build_object(
                        'userId', liker_id,
                        'avatar', liker_avatar,
                        'nickname', liker_nickname,
                        'count', total_cnt
                    )
                    ORDER BY total_cnt DESC, liker_id ASC
                ),
                '[]'::json
            )
        FROM (
            SELECT
                liker_id,
                liker_nickname,
                liker_avatar,
                SUM(cnt)::int AS total_cnt
            FROM (
                SELECT
                    ufr.user_id AS liker_id,
                    u2.nickname AS liker_nickname,
                    up2.avatar AS liker_avatar,
                    COUNT(*)::int AS cnt
                FROM "User_fav_reviews" ufr
                JOIN "Reviews" rev ON rev.id = ufr.review_id
                JOIN "Users" u2 ON u2.id = ufr.user_id
                LEFT JOIN "User_profiles" up2 ON up2.user_id = u2.id
                WHERE rev.user_id = tul.user_id
                    AND EXISTS (
                        SELECT 1
                        FROM "Registered_authors" ra
                        WHERE ra.user_id = ufr.user_id
                            AND ra.author_id IN (
                                SELECT rp.author_id
                                FROM "Release_producers" rp
                                WHERE rp.release_id = rev.release_id
                                UNION
                                SELECT ar.author_id
                                FROM "Release_artists" ar
                                WHERE ar.release_id = rev.release_id
                                UNION
                                SELECT rd.author_id
                                FROM "Release_designers" rd
                                WHERE rd.release_id = rev.release_id
                              )
                    )
                GROUP BY ufr.user_id, u2.nickname, up2.avatar

                UNION ALL

                SELECT
                    ufm.user_id AS liker_id,
                    u3.nickname AS liker_nickname,
                    up3.avatar AS liker_avatar,
                    COUNT(*)::int AS cnt
                FROM "User_fav_media" ufm
                JOIN "Release_media" rm ON rm.id = ufm.media_id
                JOIN "Users" u3 ON u3.id = ufm.user_id
                LEFT JOIN "User_profiles" up3 ON up3.user_id = u3.id
                WHERE rm.user_id = tul.user_id
                    AND EXISTS (
                        SELECT 1
                            FROM "Registered_authors" ra
                              WHERE ra.user_id = ufm.user_id
                                AND ra.author_id IN (
                                  SELECT rp.author_id
                                  FROM "Release_producers" rp
                                  WHERE rp.release_id = rm.release_id
                                  UNION
                                  SELECT ar.author_id
                                  FROM "Release_artists" ar
                                  WHERE ar.release_id = rm.release_id
                                  UNION
                                  SELECT rd.author_id
                                  FROM "Release_designers" rd
                                  WHERE rd.release_id = rm.release_id
                                )
                    )
                GROUP BY ufm.user_id, u3.nickname, up3.avatar
                ) z
                GROUP BY liker_id, liker_nickname, liker_avatar
                ORDER BY SUM(cnt) DESC, liker_id ASC
                LIMIT 3
            ) t
    ) AS "topAuthorLikers"

FROM "Top_users_leaderboard" tul
         JOIN "User_profiles" up ON up.user_id = tul.user_id
         JOIN "Users" u ON u.id = up.user_id
         LEFT JOIN "Reviews" r ON u.id = r.user_id
GROUP BY tul.user_id, tul.rank, up.points, u.nickname, up.avatar, up.cover_image
ORDER BY up.points DESC, tul.user_id;


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