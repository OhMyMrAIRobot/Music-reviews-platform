---------------------------------------------
-- FUNCTION TO CALCULATE AVG REVIEW SCORES --
CREATE OR REPLACE FUNCTION get_avg_review_score(
    _release_id TEXT,
    rating_type TEXT,
    column_name TEXT
) RETURNS NUMERIC AS $$
BEGIN
    RETURN (
        SELECT COALESCE(ROUND(AVG(
            CASE column_name
                WHEN 'rhymes' THEN rhymes
                WHEN 'structure' THEN structure
                WHEN 'realization' THEN realization
                WHEN 'individuality' THEN individuality
                WHEN 'atmosphere' THEN atmosphere
            END
        ), 1), 0)
        FROM "Reviews" r
        WHERE r.release_id = _release_id
          AND (
              (rating_type = 'Оценка медиа' AND EXISTS (
                  SELECT 1 FROM "Users" u
                  WHERE u.id = r.user_id
                    AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'Медиа')
              )) OR
              (rating_type = 'Оценка без рецензии' AND (r.text IS NULL OR r.text = '')
                  AND NOT EXISTS (
                      SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                        AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'Медиа')
                  )) OR
              (rating_type = 'Оценка с рецензией' AND (r.text IS NOT NULL AND r.text != '')
                  AND NOT EXISTS (
                      SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                        AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'Медиа')
                  ))
          )
    );
END;
$$ LANGUAGE plpgsql;


----------------------------------------
-- FUNCTION TO UPDATE RELEASE RATINGS --
create function update_release_rating() returns trigger
    language plpgsql
as
$$
DECLARE
    rating_row RECORD;
    rating_type_row RECORD;
    release_exists BOOLEAN;
    release_id_val TEXT := COALESCE(OLD.release_id, NEW.release_id);
BEGIN
    SELECT EXISTS (SELECT 1 FROM "Releases" WHERE id = release_id_val) INTO release_exists;

    IF NOT release_exists THEN
        RETURN COALESCE(NEW, OLD);
    END IF;

    DELETE FROM "Release_rating_details"
    WHERE release_rating_id IN (
        SELECT id FROM "Release_ratings" WHERE release_id = release_id_val
    );

    DELETE FROM "Release_ratings"
    WHERE release_id = release_id_val;

    FOR rating_type_row IN SELECT * FROM "Release_rating_types" LOOP
        INSERT INTO "Release_ratings" (id, release_id, release_rating_type_id, total)
        VALUES (
            gen_random_uuid(),
            release_id_val,
            rating_type_row.id,
            CEIL((
                SELECT COALESCE(AVG(total), 0)
                FROM "Reviews" r
                WHERE r.release_id = release_id_val
                  AND (
                      (rating_type_row.type = 'Оценка медиа' AND EXISTS (
                          SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                            AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'Медиа')
                      )) OR
                      (rating_type_row.type = 'Оценка без рецензии' AND (r.text IS NULL OR r.text = '')
                          AND NOT EXISTS (
                              SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                                AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'Медиа')
                          )) OR
                      (rating_type_row.type = 'Оценка с рецензией' AND (r.text IS NOT NULL AND r.text != '')
                          AND NOT EXISTS (
                              SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                                AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'Медиа')
                          ))
                  )
            ))
        ) RETURNING * INTO rating_row;

        INSERT INTO "Release_rating_details" (rhymes, structure, realization, individuality, atmosphere, release_rating_id)
        VALUES (
            get_avg_review_score(rating_row.release_id, rating_type_row.type, 'rhymes'),
            get_avg_review_score(rating_row.release_id, rating_type_row.type, 'structure'),
            get_avg_review_score(rating_row.release_id, rating_type_row.type, 'realization'),
            get_avg_review_score(rating_row.release_id, rating_type_row.type, 'individuality'),
            get_avg_review_score(rating_row.release_id, rating_type_row.type, 'atmosphere'),
            rating_row.id
        );
    END LOOP;

    RETURN COALESCE(NEW, OLD);
END;
$$;

--------------------------------------------
-- INSERT OR UPDATE OR DELETE ON "Reviews" --
CREATE OR REPLACE TRIGGER trg_update_release_rating
AFTER INSERT OR UPDATE OR DELETE ON "Reviews"
FOR EACH ROW
EXECUTE FUNCTION update_release_rating();

------------------------------------------
-- FUNCTION TO UPDATE FAV REVIEW POINTS --
CREATE OR REPLACE FUNCTION handle_fav_review_points()
    RETURNS TRIGGER AS $$
DECLARE
    points_change_author INT;
    points_change_user INT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        points_change_author := 3;
        points_change_user := 1;
    ELSIF TG_OP = 'DELETE' THEN
        points_change_author := -3;
        points_change_user := -1;
    ELSE
        RETURN NULL;
    END IF;

    UPDATE "User_profiles"
    SET points = GREATEST(points + points_change_author, 0)
    FROM "Reviews"
    WHERE "User_profiles".user_id = "Reviews".user_id
      AND "Reviews".id = COALESCE(NEW.review_id, OLD.review_id);

    UPDATE "User_profiles"
    SET points = GREATEST(points + points_change_user, 0)
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);

    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

--------------------------------------------
-- INSERT OR DELETE ON "User_fav_reviews" --
CREATE TRIGGER fav_review_points_trigger
    AFTER INSERT OR DELETE ON "User_fav_reviews"
    FOR EACH ROW
EXECUTE FUNCTION handle_fav_review_points();

-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

---------------------------------------------------------
-- FUNCTION TO UPDATE FAV RELEASE OR FAV AUTHOR POINTS --
CREATE OR REPLACE FUNCTION handle_points()
    RETURNS TRIGGER AS $$
DECLARE
    points_amount INT;
BEGIN
    -- Получаем количество очков из параметров триггера
    points_amount := TG_ARGV[0]::INT;
    
    IF TG_OP = 'INSERT' THEN
        UPDATE "User_profiles"
        SET points = points + points_amount
        WHERE user_id = NEW.user_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE "User_profiles"
        SET points = GREATEST(points - points_amount, 0)
        WHERE user_id = OLD.user_id;
    END IF;

    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER author_comment_points_trigger
    AFTER INSERT OR DELETE ON "Author_comments"
    FOR EACH ROW
EXECUTE FUNCTION handle_points(5000);

CREATE TRIGGER fav_release_points_trigger
    AFTER INSERT OR DELETE ON "User_fav_releases"
    FOR EACH ROW
EXECUTE FUNCTION handle_points(5);

CREATE TRIGGER fav_author_points_trigger
    AFTER INSERT OR DELETE ON "User_fav_authors"
    FOR EACH ROW
EXECUTE FUNCTION handle_points(5);

-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

--------------------------------------
-- FUNCTION TO UPDATE REVIEW POINTS --
CREATE OR REPLACE FUNCTION handle_review_points()
    RETURNS TRIGGER AS $$
DECLARE
    points_change INT;
    had_text BOOLEAN;
    has_text BOOLEAN;
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.title IS NULL OR NEW.title = '' THEN
            points_change := 25;
        ELSE
            points_change := 100;
        END IF;

        UPDATE "User_profiles"
        SET points = points + points_change
        WHERE user_id = NEW.user_id;

    ELSIF TG_OP = 'UPDATE' THEN
        had_text := (OLD.title IS NOT NULL AND OLD.title != '');
        has_text := (NEW.title IS NOT NULL AND NEW.title != '');

        IF NOT had_text AND has_text THEN
            points_change := 75;
            UPDATE "User_profiles"
            SET points = points + points_change
            WHERE user_id = NEW.user_id;

        ELSIF had_text AND NOT has_text THEN
            points_change := -75;
            UPDATE "User_profiles"
            SET points = GREATEST(points + points_change, 0)
            WHERE user_id = NEW.user_id;
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.title IS NULL OR OLD.title = '' THEN
            points_change := -25;
        ELSE
            points_change := -100;
        END IF;

        UPDATE "User_profiles"
        SET points = GREATEST(points + points_change, 0)
        WHERE user_id = OLD.user_id;
    END IF;

    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

-----------------------------------
-- INSERT OR UPDATE ON "REVIEWS" --
CREATE TRIGGER review_points_insert_update
    AFTER INSERT OR UPDATE OF text ON "Reviews"
    FOR EACH ROW
EXECUTE FUNCTION handle_review_points();

-------------------------
-- DELETE ON "REVIEWS" --
CREATE TRIGGER review_points_delete
    AFTER DELETE ON "Reviews"
    FOR EACH ROW
EXECUTE FUNCTION handle_review_points();

-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

----------------------------------------------
-- FUNCTION TO UPDATE TOP_USERS_LEADERBOARD --
CREATE OR REPLACE FUNCTION refresh_top_users()
    RETURNS VOID AS $$
BEGIN
    LOCK TABLE "Top_users_leaderboard" IN EXCLUSIVE MODE;

    DELETE FROM "Top_users_leaderboard"
    WHERE user_id NOT IN (
        SELECT user_id FROM "User_profiles"
        WHERE points > 0
        ORDER BY points DESC, user_id
        LIMIT 90
    );

    INSERT INTO "Top_users_leaderboard" (id, user_id, rank, updated_at)
    SELECT
        gen_random_uuid(),
        up.user_id,
        ROW_NUMBER() OVER (ORDER BY up.points DESC, up.user_id) as rank,
        Now()
    FROM
        "User_profiles" up
    WHERE
        up.points > 0 AND
        up.user_id NOT IN (SELECT user_id FROM "Top_users_leaderboard")
    ORDER BY
        up.points DESC, up.user_id
    LIMIT 90
    ON CONFLICT (user_id)
        DO UPDATE SET
        rank = EXCLUDED.rank;

    UPDATE "Top_users_leaderboard" t
    SET
        rank = subq.new_rank
    FROM (
             SELECT
                 user_id,
                 ROW_NUMBER() OVER (ORDER BY points DESC, user_id) as new_rank
             FROM "User_profiles"
             WHERE points > 0
             ORDER BY points DESC, user_id
             LIMIT 90
         ) subq
    WHERE t.user_id = subq.user_id;
END;
$$ LANGUAGE plpgsql;


-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

CREATE OR REPLACE VIEW most_reviewed_releases_last_24h AS
SELECT
    r.id,
    r.title,
    r.img,
    rt.type AS "releaseType",

    (
        SELECT COUNT(DISTINCT r_all.id)
        FROM "Reviews" r_all
        WHERE r_all.release_id = r.id AND r_all.text IS NOT NULL
    )::int AS "textCount",

    (
        SELECT COUNT(DISTINCT r_all.id)
        FROM "Reviews" r_all
        WHERE r_all.release_id = r.id AND r_all.text IS NULL
    )::int AS "withoutTextCount",

    CASE
        WHEN count(a.id) = 0 THEN '[]'::json
        ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'id', a.id,
            'name', a.name
        ))
    END AS authors,

    CASE
        WHEN count(rr.total) = 0 THEN '[]'::json
        ELSE json_agg(DISTINCT jsonb_build_object(
                'total', rr.total,
                'type', rrt.type
        ))
    END as ratings,
    COUNT(rev.id) AS "totalCount",
    EXISTS (
        SELECT 1
        FROM "Author_comments" ac
            JOIN "Registered_authors" ra ON ra.user_id = ac.user_id
        WHERE ac.release_id = r.id
            AND ra.author_id IN (
                SELECT rp.author_id
                FROM "Release_producers" rp
                WHERE rp.release_id = r.id
                UNION
                SELECT ar.author_id
                FROM "Release_artists" ar
                WHERE ar.release_id = r.id
                UNION
                SELECT rd.author_id
                FROM "Release_designers" rd
                WHERE rd.release_id = r.id
            )
    ) AS "hasAuthorComments",
    (
        EXISTS (
            SELECT 1
            FROM "User_fav_reviews" ufr
                JOIN "Reviews" r2 ON r2.id = ufr.review_id
                JOIN "Registered_authors" ra2 ON ra2.user_id = ufr.user_id
            WHERE r2.release_id = r.id
              AND ra2.author_id IN (
                SELECT rp.author_id
                FROM "Release_producers" rp
                WHERE rp.release_id = r.id
                UNION
                SELECT ar.author_id
                FROM "Release_artists" ar
                WHERE ar.release_id = r.id
                UNION
                SELECT rd.author_id
                FROM "Release_designers" rd
                WHERE rd.release_id = r.id
            )
        )
        OR
        EXISTS (
            SELECT 1
            FROM "User_fav_media" ufm
                JOIN "Release_media" rm ON rm.id = ufm.media_id
                JOIN "Registered_authors" ra3 ON ra3.user_id = ufm.user_id
            WHERE rm.release_id = r.id
              AND ra3.author_id IN (
                SELECT rp.author_id FROM "Release_producers" rp WHERE rp.release_id = r.id
                UNION
                SELECT ar.author_id FROM "Release_artists" ar WHERE ar.release_id = r.id
                UNION
                SELECT rd.author_id FROM "Release_designers" rd WHERE rd.release_id = r.id
            )
        )
    ) AS "hasAuthorLikes"
FROM "Releases" r
         LEFT JOIN "Release_artists" ra ON r.id = ra.release_id
         LEFT JOIN "Authors" a ON ra.author_id = a.id
         LEFT JOIN "Reviews" rev ON rev.release_id = r.id
    AND rev.created_at >= NOW() - INTERVAL '24 hours'
         LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
         LEFT JOIN "Release_ratings" rr ON r.id = rr.release_id
         LEFT JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
GROUP BY r.id, rt.type
HAVING COUNT(rev.id) > 0
ORDER BY "totalCount" DESC;

-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

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
    )) AS "ratingDetails"
FROM "Releases" r
         LEFT JOIN "Release_types" rt ON r.release_type_id = rt.id
         LEFT JOIN "User_fav_releases" ufr ON r.id = ufr.release_id
         LEFT JOIN "Release_ratings" rr ON r.id = rr.release_id
         LEFT JOIN "Release_rating_types" rrt ON rr.release_rating_type_id = rrt.id
         LEFT JOIN "Release_rating_details" rrd ON rr.id = rrd.release_rating_id
GROUP BY r.id, rt.type;

-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

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
        SELECT COUNT(*)
        FROM "User_fav_reviews" ufr
                 JOIN "Reviews" rev ON ufr.review_id = rev.id
        WHERE rev.user_id = u.id
    )::int AS "receivedLikes",
    (
        SELECT COUNT(*)
        FROM "User_fav_reviews" ufr
                 JOIN "Reviews" rev ON ufr.review_id = rev.id
        WHERE ufr.user_id = u.id AND rev.user_id != u.id
    )::int AS "givenLikes",
    CASE
        WHEN count(sm.id) = 0 THEN '[]'::json
        ELSE JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', sm.id, 'name', sm.name, 'url', psm.url))
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

-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

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

    (SELECT COUNT(*)
     FROM "User_fav_reviews" ufr
              JOIN "Reviews" rev ON ufr.review_id = rev.id
     WHERE rev.user_id = tul.user_id)::int AS "receivedLikes",

    (SELECT COUNT(*)
     FROM "User_fav_reviews" ufr
              JOIN "Reviews" rev ON ufr.review_id = rev.id
     WHERE ufr.user_id = tul.user_id AND rev.user_id != tul.user_id)::int AS "givenLikes",

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
    )::int AS "withoutTextRatings";