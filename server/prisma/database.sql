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
              (rating_type = 'super_user' AND EXISTS (
                  SELECT 1 FROM "Users" u
                  WHERE u.id = r.user_id
                    AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'SuperUser')
              )) OR
              (rating_type = 'no_text' AND (r.text IS NULL OR r.text = '')
                  AND NOT EXISTS (
                      SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                        AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'SuperUser')
                  )) OR
              (rating_type = 'with_text' AND r.text IS NOT NULL AND r.text != ''
                  AND NOT EXISTS (
                      SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                        AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'SuperUser')
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
BEGIN
    DELETE FROM "Release_rating_details"
    WHERE release_rating_id IN (
        SELECT id FROM "Release_ratings" WHERE release_id = COALESCE(OLD.release_id, NEW.release_id)
    );
    
    DELETE FROM "Release_ratings"
    WHERE release_id = COALESCE(OLD.release_id, NEW.release_id);

    FOR rating_type_row IN SELECT * FROM "Release_rating_types" LOOP
        INSERT INTO "Release_ratings" (id, release_id, release_rating_type_id, total)
        VALUES (
            gen_random_uuid(),
            COALESCE(OLD.release_id, NEW.release_id),
            rating_type_row.id,
            CEIL((
                SELECT COALESCE(AVG(total), 0)
                FROM "Reviews" r
                WHERE r.release_id = COALESCE(OLD.release_id, NEW.release_id)
                  AND (
                      (rating_type_row.type = 'super_user' AND EXISTS (
                          SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                            AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'SuperUser')
                      )) OR
                      (rating_type_row.type = 'no_text' AND (r.text IS NULL OR r.text = '')
                          AND NOT EXISTS (
                              SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                                AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'SuperUser')
                          )) OR
                      (rating_type_row.type = 'with_text' AND r.text IS NOT NULL AND r.text != ''
                          AND NOT EXISTS (
                              SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                                AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'SuperUser')
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

-------------------------------------------------------------------------
-------------------------------------------------------------------------
-------------------------------------------------------------------------

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
        ORDER BY points DESC
        LIMIT 90
    );

    INSERT INTO "Top_users_leaderboard" (id, user_id, rank, updated_at)
    SELECT
        gen_random_uuid(),
        up.user_id,
        ROW_NUMBER() OVER (ORDER BY up.points DESC) as rank,
        Now()
    FROM
        "User_profiles" up
    WHERE
        up.points > 0 AND
        up.user_id NOT IN (SELECT user_id FROM "Top_users_leaderboard")
    ORDER BY
        up.points DESC
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
                 ROW_NUMBER() OVER (ORDER BY points DESC) as new_rank
             FROM "User_profiles"
             WHERE points > 0
             ORDER BY points DESC
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