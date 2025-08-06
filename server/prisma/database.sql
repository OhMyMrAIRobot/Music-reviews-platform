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
CREATE OR REPLACE FUNCTION handle_favorite_points()
    RETURNS TRIGGER AS $$
DECLARE
    points_change INT;
BEGIN
    IF TG_OP = 'INSERT' THEN
        points_change := 5;
    ELSIF TG_OP = 'DELETE' THEN
        points_change := -5;
    ELSE
        RETURN NULL;
    END IF;

    IF points_change > 0 THEN
        UPDATE "User_profiles"
        SET points = points + points_change
        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
    ELSE
        UPDATE "User_profiles"
        SET points = GREATEST(points + points_change, 0)
        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
    END IF;

    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

-------------------------------------------------------------------
-- INSERT OR DELETE ON "User_fav_releases" and "User_fav_authors"--
CREATE TRIGGER fav_release_points_trigger
    AFTER INSERT OR DELETE ON "User_fav_releases"
    FOR EACH ROW
EXECUTE FUNCTION handle_favorite_points();

CREATE TRIGGER fav_author_points_trigger
    AFTER INSERT OR DELETE ON "User_fav_authors"
    FOR EACH ROW
EXECUTE FUNCTION handle_favorite_points();

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


--------------------------------------------
-- FUNCTION TO EXECUTE UPDATE LEADERBOARD --
CREATE OR REPLACE FUNCTION update_leaderboard_on_change()
    RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT MAX(updated_at) FROM "Top_users_leaderboard") < NOW() - INTERVAL '30 minutes' THEN
        PERFORM refresh_top_users();
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

------------------------------------
-- TRIGGER FOR UPDATE LEADERBOARD --
CREATE TRIGGER trigger_leaderboard_update
    AFTER INSERT OR UPDATE OF points ON "User_profiles"
    FOR EACH STATEMENT
EXECUTE FUNCTION update_leaderboard_on_change();


-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

CREATE VIEW best_releases_last_24h AS
SELECT
    r.id,
    r.title,
    r.img,
    rt.type AS release_type,

    (
        SELECT COUNT(DISTINCT r_all.id)
        FROM "Reviews" r_all
        WHERE r_all.release_id = r.id AND r_all.text IS NOT NULL
    )::int AS text_count,

    (
        SELECT COUNT(DISTINCT r_all.id)
        FROM "Reviews" r_all
        WHERE r_all.release_id = r.id AND r_all.text IS NULL
    )::int AS no_text_count,

    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'id', a.id,
            'name', a.name
                      )) AS author,

    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'total', rr.total,
            'type', rrt.type
                      )) AS ratings,
    COUNT(rev.id) AS total_reviews
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
ORDER BY total_reviews DESC;

-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

CREATE OR REPLACE VIEW release_summary AS
SELECT
    r.id,
    r.title,
    EXTRACT(YEAR FROM r.publish_date) AS year,
    r.img AS release_img,
    rt.type AS release_type,
    (
        SELECT JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                'id', a.id,
                'name', a.name,
                'img', a.avatar_img
                                 ))
        FROM "Release_artists" ra
                 JOIN "Authors" a ON ra.author_id = a.id
        WHERE ra.release_id = r.id
    ) AS artists,
    (
        SELECT JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                'id', a.id,
                'name', a.name,
                'img', a.avatar_img
                                 ))
        FROM "Release_producers" rp
                 JOIN "Authors" a ON rp.author_id = a.id
        WHERE rp.release_id = r.id
    ) AS producers,
    (
        SELECT JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                'id', a.id,
                'name', a.name,
                'img', a.avatar_img
                                 ))
        FROM "Release_designers" rd
                 JOIN "Authors" a ON rd.author_id = a.id
        WHERE rd.release_id = r.id
    ) AS designers,
    COUNT(DISTINCT ufr.user_id)::int AS likes_count,
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'userId', ufr.user_id,
            'releaseId', ufr.release_id
                      )) AS user_fav_ids,
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'type', rrt.type,
            'total', rr.total
                      )) AS ratings,
    JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'type', rrt.type,
            'details', rrd
                      )) AS rating_details
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
    (COUNT(DISTINCT r.id) FILTER (WHERE r.text IS NULL))::int AS "noTextCount",
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
        END AS social
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
    tul.user_id,
    tul.rank,
    up.points,
    u.nickname,
    up.avatar,
    up.cover_image as cover,
    (count(DISTINCT r.id) FILTER (WHERE r.text IS NOT NULL))::int AS text_count,
    (count(DISTINCT r.id) FILTER (WHERE r.text IS NULL))::int AS no_text_count,
    (SELECT COUNT(*)
     FROM "User_fav_reviews" ufr
              JOIN "Reviews" rev ON ufr.review_id = rev.id
     WHERE rev.user_id = tul.user_id)::int AS received_likes,
    (SELECT COUNT(*)
     FROM "User_fav_reviews" ufr
              JOIN "Reviews" rev ON ufr.review_id = rev.id
     WHERE ufr.user_id = tul.user_id AND rev.user_id != tul.user_id)::int AS given_likes
FROM "Top_users_leaderboard" tul
         JOIN "User_profiles" up on up.user_id = tul.user_id
         JOIN "Users" u on u.id = up.user_id
         LEFT JOIN "Reviews" r on u.id = r.user_id
GROUP BY tul.user_id,
         tul.rank,
         up.points,
         u.nickname,
         up.avatar,
         up.cover_image
ORDER BY up.points DESC, tul.user_id