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



