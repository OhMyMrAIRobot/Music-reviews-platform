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
              )) 
							OR
              (rating_type = 'Оценка без рецензии' AND (r.text IS NULL OR r.text = '')
                  AND NOT EXISTS (
                      SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                        AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'Медиа')
              )) 
							OR
              (rating_type = 'Оценка с рецензией' AND (r.text IS NOT NULL AND r.text != '')
                  AND NOT EXISTS (
                      SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                        AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'Медиа')
              ))
          )
    );
END;
$$ LANGUAGE plpgsql;


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
                      )) 
											OR
                      (rating_type_row.type = 'Оценка без рецензии' AND (r.text IS NULL OR r.text = '')
                          AND NOT EXISTS (
                              SELECT 1 FROM "Users" u WHERE u.id = r.user_id
                                AND u.role_id = (SELECT id FROM "Roles" WHERE role = 'Медиа')
                      )) 
											OR
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


CREATE OR REPLACE FUNCTION handle_fav_review_points()
RETURNS TRIGGER AS $$
DECLARE
    points_change_author INT;
    points_change_user INT;
    is_author_like BOOLEAN;
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

    SELECT EXISTS (
        SELECT 1
        FROM "Reviews" rv
        WHERE rv.id = COALESCE(NEW.review_id, OLD.review_id)
          AND EXISTS (
              SELECT 1
              FROM "Registered_authors" ra
              WHERE ra.user_id = COALESCE(NEW.user_id, OLD.user_id)
                AND ra.author_id IN (
                  SELECT rp.author_id 
                  FROM "Release_producers" rp 
                  WHERE rp.release_id = rv.release_id
                  UNION
                  SELECT ar.author_id 
                  FROM "Release_artists" ar 
                  WHERE ar.release_id = rv.release_id
                  UNION
                  SELECT rd.author_id 
                  FROM "Release_designers" rd 
                  WHERE rd.release_id = rv.release_id
                )
          )
    ) INTO is_author_like;

    IF is_author_like THEN
        IF TG_OP = 'INSERT' THEN
            points_change_author := 500;
            points_change_user := 100;
        ELSE
            points_change_author := -500;
            points_change_user := -100;
        END IF;
    END IF;

    UPDATE "User_profiles" up
    SET points = GREATEST(up.points + points_change_author, 0)
    FROM "Reviews" rv
    WHERE up.user_id = rv.user_id
      AND rv.id = COALESCE(NEW.review_id, OLD.review_id);

    UPDATE "User_profiles" up
    SET points = GREATEST(up.points + points_change_user, 0)
    WHERE up.user_id = COALESCE(NEW.user_id, OLD.user_id);

    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION handle_points()
    RETURNS TRIGGER AS $$
DECLARE
    points_amount INT;
BEGIN
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


CREATE OR REPLACE FUNCTION handle_fav_media_points()
RETURNS TRIGGER AS $$
DECLARE
    points_change_owner INT;
    points_change_user INT;
    is_author_like BOOLEAN;
    v_media_id TEXT;
    v_user_id TEXT;
BEGIN
    v_media_id := COALESCE(NEW.media_id, OLD.media_id);
    v_user_id := COALESCE(NEW.user_id, OLD.user_id);

    IF TG_OP = 'INSERT' THEN
        points_change_owner := 3;
        points_change_user  := 1;
    ELSIF TG_OP = 'DELETE' THEN
        points_change_owner := -3;
        points_change_user  := -1;
    ELSE
        RETURN NULL;
    END IF;

    SELECT EXISTS (
        SELECT 1
        FROM "Release_media" rm
        WHERE rm.id = v_media_id
          AND EXISTS (
            SELECT 1
            FROM "Registered_authors" ra
            WHERE ra.user_id = v_user_id
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
    ) INTO is_author_like;

    IF is_author_like THEN
        IF TG_OP = 'INSERT' THEN
            points_change_owner := 500;
            points_change_user  := 100;
        ELSE
            points_change_owner := -500;
            points_change_user  := -100;
        END IF;
    END IF;

    UPDATE "User_profiles" up
    SET points = GREATEST(up.points + points_change_owner, 0)
    FROM "Release_media" rm
    WHERE rm.id = v_media_id
      AND up.user_id = rm.user_id;

    UPDATE "User_profiles" up
    SET points = GREATEST(up.points + points_change_user, 0)
    WHERE up.user_id = v_user_id;

    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION album_value_get_influence_multiplier(points numeric)
    RETURNS numeric
    LANGUAGE sql
    IMMUTABLE
AS $$
SELECT CASE ROUND(points)::int
           WHEN 1 THEN 1.12
           WHEN 2 THEN 1.34
           WHEN 3 THEN 1.50
           WHEN 4 THEN 1.62
           WHEN 5 THEN 1.72
           WHEN 6 THEN 1.81
           WHEN 7 THEN 1.88
           WHEN 8 THEN 1.94
           WHEN 9 THEN 2.00
           END::numeric;
$$;


CREATE OR REPLACE FUNCTION album_value_vote_contrib(
    rarity_genre               numeric,
    rarity_performance         numeric,
    format_release_score       integer,
    integrity_genre            numeric,
    integrity_semantic         numeric,
    depth_score                integer,
    quality_rhymes_images      integer,
    quality_structure_rhythm   integer,
    quality_style_impl         integer,
    quality_individuality      integer,
    influence_author_popularity numeric,
    influence_release_anticip   numeric
)
    RETURNS TABLE (
            sum_rarity_genre               numeric,
            sum_rarity_performance         numeric,
            sum_format_release_score       integer,
            sum_integrity_genre            numeric,
            sum_integrity_semantic         numeric,
            sum_depth                      integer,
            sum_quality_rhymes_images      integer,
            sum_quality_structure_rhythm   integer,
            sum_quality_style_impl         integer,
            sum_quality_individuality      integer,
            sum_quality_points             integer,
            sum_quality_factor             numeric,
            sum_influence_author_popularity numeric,
            sum_influence_release_anticip   numeric,
            sum_influence_points            numeric,
            sum_influence_multiplier        numeric,
            sum_core                       numeric,
            sum_final_value                 numeric
    )
    LANGUAGE sql
    IMMUTABLE
AS $$
WITH base AS (
    SELECT
        rarity_genre::numeric               AS rarity_genre,
        rarity_performance::numeric         AS rarity_performance,
        format_release_score::int           AS format_release_score,
        integrity_genre::numeric            AS integrity_genre,
        integrity_semantic::numeric         AS integrity_semantic,
        depth_score::int                    AS depth_score,
        quality_rhymes_images::int          AS quality_rhymes_images,
        quality_structure_rhythm::int       AS quality_structure_rhythm,
        quality_style_impl::int             AS quality_style_impl,
        quality_individuality::int          AS quality_individuality,
        influence_author_popularity::numeric AS influence_author_popularity,
        influence_release_anticip::numeric   AS influence_release_anticip
),
     calc AS (
         SELECT
             *,
             (quality_rhymes_images + quality_structure_rhythm + quality_style_impl + quality_individuality)                                  AS quality_points,
             (quality_rhymes_images + quality_structure_rhythm + quality_style_impl + quality_individuality) * 0.025::numeric                 AS quality_factor,
             (influence_author_popularity + influence_release_anticip) AS influence_points,
             album_value_get_influence_multiplier(influence_author_popularity + influence_release_anticip)                               AS influence_multiplier,
             (rarity_genre + rarity_performance + format_release_score + integrity_genre + integrity_semantic + depth_score)                       AS core
         FROM base
     )
SELECT
    rarity_genre,
    rarity_performance,
    format_release_score,
    integrity_genre,
    integrity_semantic,
    depth_score,
    quality_rhymes_images,
    quality_structure_rhythm,
    quality_style_impl,
    quality_individuality,
    quality_points,
    quality_factor,
    influence_author_popularity,
    influence_release_anticip,
    influence_points,
    influence_multiplier,
    core,
    core * quality_factor * influence_multiplier
FROM calc;
$$;


CREATE OR REPLACE FUNCTION trg_album_value_votes_aggregate()
    RETURNS trigger
    LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        WITH newc AS (
            SELECT * FROM album_value_vote_contrib(
                    NEW.rarity_genre,
                    NEW.rarity_performance,
                    NEW.format_release_score,
                    NEW.integrity_genre,
                    NEW.integrity_semantic,
                    NEW.depth_score,
                    NEW.quality_rhymes_images,
                    NEW.quality_structure_rhythm,
                    NEW.quality_style_impl,
                    NEW.quality_individuality,
                    NEW.influence_author_popularity,
                    NEW.influence_release_anticip
            )
        )
        INSERT INTO "Album_value_aggregate" (
            release_id, votes_count,
            sum_rarity_genre, sum_rarity_performance, sum_format_release_score,
            sum_integrity_genre, sum_integrity_semantic, sum_depth,
            sum_quality_rhymes_images, sum_quality_structure_rhythm, sum_quality_style_impl, sum_quality_individuality,
            sum_quality_points, sum_quality_factor,
            sum_influence_author_popularity, sum_influence_release_anticip, sum_influence_points, sum_influence_multiplier,
            sum_core, sum_final_value,
            rarity_genre_avg, rarity_performance_avg, rarity_avg,
            format_release_score_avg, integrity_genre_avg, integrity_semantic_avg, integrity_avg,
            depth_avg,
            quality_rhymes_images_avg, quality_structure_rhythm_avg, quality_style_impl_avg, quality_individuality_avg,
            quality_points_avg, quality_factor_avg,
            influence_author_popularity_avg, influence_release_anticip_avg, influence_points_avg, influence_multiplier_avg,
            core_sum_avg, value_avg, updated_at
        )
        SELECT
            NEW.release_id, 1,
            newc.sum_rarity_genre, newc.sum_rarity_performance, newc.sum_format_release_score,
            newc.sum_integrity_genre, newc.sum_integrity_semantic, newc.sum_depth,
            newc.sum_quality_rhymes_images, newc.sum_quality_structure_rhythm, newc.sum_quality_style_impl, newc.sum_quality_individuality,
            newc.sum_quality_points, newc.sum_quality_factor,
            newc.sum_influence_author_popularity, newc.sum_influence_release_anticip, newc.sum_influence_points, newc.sum_influence_multiplier,
            newc.sum_core, newc.sum_final_value,
            ROUND(newc.sum_rarity_genre, 2), ROUND(newc.sum_rarity_performance, 2),
            ROUND(newc.sum_rarity_genre + newc.sum_rarity_performance, 2),
            ROUND(newc.sum_format_release_score::numeric, 2),
            ROUND(newc.sum_integrity_genre, 2), ROUND(newc.sum_integrity_semantic, 2),
            ROUND((newc.sum_format_release_score::numeric + newc.sum_integrity_genre + newc.sum_integrity_semantic), 2),
            ROUND(newc.sum_depth::numeric, 2),
            ROUND(newc.sum_quality_rhymes_images::numeric, 2), ROUND(newc.sum_quality_structure_rhythm::numeric, 2),
            ROUND(newc.sum_quality_style_impl::numeric, 2), ROUND(newc.sum_quality_individuality::numeric, 2),
            ROUND(newc.sum_quality_points::numeric, 2), ROUND(newc.sum_quality_factor, 4),
            ROUND(newc.sum_influence_author_popularity, 2), ROUND(newc.sum_influence_release_anticip, 2),
            ROUND(newc.sum_influence_points, 2), ROUND(newc.sum_influence_multiplier, 2),
            ROUND(newc.sum_core, 2), ROUND(newc.sum_final_value, 2), now()
        FROM newc
        ON CONFLICT (release_id) DO UPDATE
            SET
                votes_count = "Album_value_aggregate".votes_count + 1,

                sum_rarity_genre = "Album_value_aggregate".sum_rarity_genre + EXCLUDED.sum_rarity_genre,
                sum_rarity_performance = "Album_value_aggregate".sum_rarity_performance + EXCLUDED.sum_rarity_performance,
                sum_format_release_score = "Album_value_aggregate".sum_format_release_score + EXCLUDED.sum_format_release_score,
                sum_integrity_genre = "Album_value_aggregate".sum_integrity_genre + EXCLUDED.sum_integrity_genre,
                sum_integrity_semantic = "Album_value_aggregate".sum_integrity_semantic + EXCLUDED.sum_integrity_semantic,
                sum_depth = "Album_value_aggregate".sum_depth + EXCLUDED.sum_depth,
                sum_quality_rhymes_images = "Album_value_aggregate".sum_quality_rhymes_images + EXCLUDED.sum_quality_rhymes_images,
                sum_quality_structure_rhythm = "Album_value_aggregate".sum_quality_structure_rhythm + EXCLUDED.sum_quality_structure_rhythm,
                sum_quality_style_impl = "Album_value_aggregate".sum_quality_style_impl + EXCLUDED.sum_quality_style_impl,
                sum_quality_individuality = "Album_value_aggregate".sum_quality_individuality + EXCLUDED.sum_quality_individuality,
                sum_quality_points = "Album_value_aggregate".sum_quality_points + EXCLUDED.sum_quality_points,
                sum_quality_factor = "Album_value_aggregate".sum_quality_factor + EXCLUDED.sum_quality_factor,
                sum_influence_author_popularity = "Album_value_aggregate".sum_influence_author_popularity + EXCLUDED.sum_influence_author_popularity,
                sum_influence_release_anticip = "Album_value_aggregate".sum_influence_release_anticip + EXCLUDED.sum_influence_release_anticip,
                sum_influence_points = "Album_value_aggregate".sum_influence_points + EXCLUDED.sum_influence_points,
                sum_influence_multiplier = "Album_value_aggregate".sum_influence_multiplier + EXCLUDED.sum_influence_multiplier,
                sum_core = "Album_value_aggregate".sum_core + EXCLUDED.sum_core,
                sum_final_value = "Album_value_aggregate".sum_final_value + EXCLUDED.sum_final_value,

                rarity_genre_avg = ROUND( ("Album_value_aggregate".sum_rarity_genre + EXCLUDED.sum_rarity_genre) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                rarity_performance_avg = ROUND( ("Album_value_aggregate".sum_rarity_performance + EXCLUDED.sum_rarity_performance) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                rarity_avg = ROUND( (("Album_value_aggregate".sum_rarity_genre + EXCLUDED.sum_rarity_genre)
                    + ("Album_value_aggregate".sum_rarity_performance + EXCLUDED.sum_rarity_performance)) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),

                format_release_score_avg = ROUND( ("Album_value_aggregate".sum_format_release_score + EXCLUDED.sum_format_release_score)::numeric / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                integrity_genre_avg = ROUND( ("Album_value_aggregate".sum_integrity_genre + EXCLUDED.sum_integrity_genre) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                integrity_semantic_avg = ROUND( ("Album_value_aggregate".sum_integrity_semantic + EXCLUDED.sum_integrity_semantic) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                integrity_avg = ROUND( (("Album_value_aggregate".sum_format_release_score + EXCLUDED.sum_format_release_score)::numeric
                    + ("Album_value_aggregate".sum_integrity_genre + EXCLUDED.sum_integrity_genre)
                    + ("Album_value_aggregate".sum_integrity_semantic + EXCLUDED.sum_integrity_semantic)) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),

                depth_avg = ROUND( ("Album_value_aggregate".sum_depth + EXCLUDED.sum_depth)::numeric / ("Album_value_aggregate".votes_count + 1)::numeric, 2),

                quality_rhymes_images_avg = ROUND( ("Album_value_aggregate".sum_quality_rhymes_images + EXCLUDED.sum_quality_rhymes_images)::numeric / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                quality_structure_rhythm_avg = ROUND( ("Album_value_aggregate".sum_quality_structure_rhythm + EXCLUDED.sum_quality_structure_rhythm)::numeric / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                quality_style_impl_avg = ROUND( ("Album_value_aggregate".sum_quality_style_impl + EXCLUDED.sum_quality_style_impl)::numeric / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                quality_individuality_avg = ROUND( ("Album_value_aggregate".sum_quality_individuality + EXCLUDED.sum_quality_individuality)::numeric / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                quality_points_avg = ROUND( ("Album_value_aggregate".sum_quality_points + EXCLUDED.sum_quality_points)::numeric / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                quality_factor_avg = ROUND( ("Album_value_aggregate".sum_quality_factor + EXCLUDED.sum_quality_factor) / ("Album_value_aggregate".votes_count + 1)::numeric, 4),

                influence_author_popularity_avg = ROUND( ("Album_value_aggregate".sum_influence_author_popularity + EXCLUDED.sum_influence_author_popularity) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                influence_release_anticip_avg = ROUND( ("Album_value_aggregate".sum_influence_release_anticip + EXCLUDED.sum_influence_release_anticip) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                influence_points_avg = ROUND( ("Album_value_aggregate".sum_influence_points + EXCLUDED.sum_influence_points) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                influence_multiplier_avg = ROUND( ("Album_value_aggregate".sum_influence_multiplier + EXCLUDED.sum_influence_multiplier) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),

                core_sum_avg = ROUND( ("Album_value_aggregate".sum_core + EXCLUDED.sum_core) / ("Album_value_aggregate".votes_count + 1)::numeric, 2),
                value_avg = ROUND( ("Album_value_aggregate".sum_final_value + EXCLUDED.sum_final_value) / ("Album_value_aggregate".votes_count + 1)::numeric, 2)
        ;

        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        WITH newc AS (
            SELECT * FROM album_value_vote_contrib(
                    NEW.rarity_genre, NEW.rarity_performance, NEW.format_release_score,
                    NEW.integrity_genre, NEW.integrity_semantic, NEW.depth_score,
                    NEW.quality_rhymes_images, NEW.quality_structure_rhythm, NEW.quality_style_impl, NEW.quality_individuality,
                    NEW.influence_author_popularity, NEW.influence_release_anticip
            )
        ),
        oldc AS (
                SELECT * FROM album_value_vote_contrib(
                        OLD.rarity_genre, OLD.rarity_performance, OLD.format_release_score,
                        OLD.integrity_genre, OLD.integrity_semantic, OLD.depth_score,
                        OLD.quality_rhymes_images, OLD.quality_structure_rhythm, OLD.quality_style_impl, OLD.quality_individuality,
                        OLD.influence_author_popularity, OLD.influence_release_anticip
                )
        )
        UPDATE "Album_value_aggregate" a
        SET
            sum_rarity_genre = a.sum_rarity_genre + (newc.sum_rarity_genre - oldc.sum_rarity_genre),
            sum_rarity_performance = a.sum_rarity_performance + (newc.sum_rarity_performance - oldc.sum_rarity_performance),
            sum_format_release_score = a.sum_format_release_score + (newc.sum_format_release_score - oldc.sum_format_release_score),
            sum_integrity_genre = a.sum_integrity_genre + (newc.sum_integrity_genre - oldc.sum_integrity_genre),
            sum_integrity_semantic = a.sum_integrity_semantic + (newc.sum_integrity_semantic - oldc.sum_integrity_semantic),
            sum_depth = a.sum_depth + (newc.sum_depth - oldc.sum_depth),
            sum_quality_rhymes_images = a.sum_quality_rhymes_images + (newc.sum_quality_rhymes_images - oldc.sum_quality_rhymes_images),
            sum_quality_structure_rhythm = a.sum_quality_structure_rhythm + (newc.sum_quality_structure_rhythm - oldc.sum_quality_structure_rhythm),
            sum_quality_style_impl = a.sum_quality_style_impl + (newc.sum_quality_style_impl - oldc.sum_quality_style_impl),
            sum_quality_individuality = a.sum_quality_individuality + (newc.sum_quality_individuality - oldc.sum_quality_individuality),
            sum_quality_points = a.sum_quality_points + (newc.sum_quality_points - oldc.sum_quality_points),
            sum_quality_factor = a.sum_quality_factor + (newc.sum_quality_factor - oldc.sum_quality_factor),
            sum_influence_author_popularity = a.sum_influence_author_popularity + (newc.sum_influence_author_popularity - oldc.sum_influence_author_popularity),
            sum_influence_release_anticip = a.sum_influence_release_anticip + (newc.sum_influence_release_anticip - oldc.sum_influence_release_anticip),
            sum_influence_points = a.sum_influence_points + (newc.sum_influence_points - oldc.sum_influence_points),
            sum_influence_multiplier = a.sum_influence_multiplier + (newc.sum_influence_multiplier - oldc.sum_influence_multiplier),
            sum_core = a.sum_core + (newc.sum_core - oldc.sum_core),
            sum_final_value = a.sum_final_value + (newc.sum_final_value - oldc.sum_final_value),

            rarity_genre_avg = ROUND( (a.sum_rarity_genre + (newc.sum_rarity_genre - oldc.sum_rarity_genre)) / a.votes_count::numeric, 2),
            rarity_performance_avg = ROUND( (a.sum_rarity_performance + (newc.sum_rarity_performance - oldc.sum_rarity_performance)) / a.votes_count::numeric, 2),
            rarity_avg = ROUND(
                    ((a.sum_rarity_genre + (newc.sum_rarity_genre - oldc.sum_rarity_genre))
                        + (a.sum_rarity_performance + (newc.sum_rarity_performance - oldc.sum_rarity_performance))) / a.votes_count::numeric, 2),

            format_release_score_avg = ROUND( (a.sum_format_release_score + (newc.sum_format_release_score - oldc.sum_format_release_score))::numeric / a.votes_count::numeric, 2),
            integrity_genre_avg = ROUND( (a.sum_integrity_genre + (newc.sum_integrity_genre - oldc.sum_integrity_genre)) / a.votes_count::numeric, 2),
            integrity_semantic_avg = ROUND( (a.sum_integrity_semantic + (newc.sum_integrity_semantic - oldc.sum_integrity_semantic)) / a.votes_count::numeric, 2),
            integrity_avg = ROUND(
                    ((a.sum_format_release_score + (newc.sum_format_release_score - oldc.sum_format_release_score))::numeric
                        + (a.sum_integrity_genre + (newc.sum_integrity_genre - oldc.sum_integrity_genre))
                        + (a.sum_integrity_semantic + (newc.sum_integrity_semantic - oldc.sum_integrity_semantic))) / a.votes_count::numeric, 2),

            depth_avg = ROUND( (a.sum_depth + (newc.sum_depth - oldc.sum_depth))::numeric / a.votes_count::numeric, 2),

            quality_rhymes_images_avg = ROUND( (a.sum_quality_rhymes_images + (newc.sum_quality_rhymes_images - oldc.sum_quality_rhymes_images))::numeric / a.votes_count::numeric, 2),
            quality_structure_rhythm_avg = ROUND( (a.sum_quality_structure_rhythm + (newc.sum_quality_structure_rhythm - oldc.sum_quality_structure_rhythm))::numeric / a.votes_count::numeric, 2),
            quality_style_impl_avg = ROUND( (a.sum_quality_style_impl + (newc.sum_quality_style_impl - oldc.sum_quality_style_impl))::numeric / a.votes_count::numeric, 2),
            quality_individuality_avg = ROUND( (a.sum_quality_individuality + (newc.sum_quality_individuality - oldc.sum_quality_individuality))::numeric / a.votes_count::numeric, 2),
            quality_points_avg = ROUND( (a.sum_quality_points + (newc.sum_quality_points - oldc.sum_quality_points))::numeric / a.votes_count::numeric, 2),
            quality_factor_avg = ROUND( (a.sum_quality_factor + (newc.sum_quality_factor - oldc.sum_quality_factor)) / a.votes_count::numeric, 4),

            influence_author_popularity_avg = ROUND( (a.sum_influence_author_popularity + (newc.sum_influence_author_popularity - oldc.sum_influence_author_popularity)) / a.votes_count::numeric, 2),
            influence_release_anticip_avg = ROUND( (a.sum_influence_release_anticip + (newc.sum_influence_release_anticip - oldc.sum_influence_release_anticip)) / a.votes_count::numeric, 2),
            influence_points_avg = ROUND( (a.sum_influence_points + (newc.sum_influence_points - oldc.sum_influence_points)) / a.votes_count::numeric, 2),
            influence_multiplier_avg = ROUND( (a.sum_influence_multiplier + (newc.sum_influence_multiplier - oldc.sum_influence_multiplier)) / a.votes_count::numeric, 2),

            core_sum_avg = ROUND( (a.sum_core + (newc.sum_core - oldc.sum_core)) / a.votes_count::numeric, 2),
            value_avg = ROUND( (a.sum_final_value + (newc.sum_final_value - oldc.sum_final_value)) / a.votes_count::numeric, 2)
        FROM newc, oldc
        WHERE a.release_id = NEW.release_id;

        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        WITH oldc AS (
            SELECT * FROM album_value_vote_contrib(
                    OLD.rarity_genre, OLD.rarity_performance, OLD.format_release_score,
                    OLD.integrity_genre, OLD.integrity_semantic, OLD.depth_score,
                    OLD.quality_rhymes_images, OLD.quality_structure_rhythm, OLD.quality_style_impl, OLD.quality_individuality,
                    OLD.influence_author_popularity, OLD.influence_release_anticip
            )
        )
        UPDATE "Album_value_aggregate" a
        SET
            votes_count = a.votes_count - 1,

            sum_rarity_genre = a.sum_rarity_genre - oldc.sum_rarity_genre,
            sum_rarity_performance = a.sum_rarity_performance - oldc.sum_rarity_performance,
            sum_format_release_score = a.sum_format_release_score - oldc.sum_format_release_score,
            sum_integrity_genre = a.sum_integrity_genre - oldc.sum_integrity_genre,
            sum_integrity_semantic = a.sum_integrity_semantic - oldc.sum_integrity_semantic,
            sum_depth = a.sum_depth - oldc.sum_depth,
            sum_quality_rhymes_images = a.sum_quality_rhymes_images - oldc.sum_quality_rhymes_images,
            sum_quality_structure_rhythm = a.sum_quality_structure_rhythm - oldc.sum_quality_structure_rhythm,
            sum_quality_style_impl = a.sum_quality_style_impl - oldc.sum_quality_style_impl,
            sum_quality_individuality = a.sum_quality_individuality - oldc.sum_quality_individuality,
            sum_quality_points = a.sum_quality_points - oldc.sum_quality_points,
            sum_quality_factor = a.sum_quality_factor - oldc.sum_quality_factor,
            sum_influence_author_popularity = a.sum_influence_author_popularity - oldc.sum_influence_author_popularity,
            sum_influence_release_anticip = a.sum_influence_release_anticip - oldc.sum_influence_release_anticip,
            sum_influence_points = a.sum_influence_points - oldc.sum_influence_points,
            sum_influence_multiplier = a.sum_influence_multiplier - oldc.sum_influence_multiplier,
            sum_core = a.sum_core - oldc.sum_core,
            sum_final_value = a.sum_final_value - oldc.sum_final_value,

            rarity_genre_avg = CASE 
                                    WHEN (a.votes_count - 1) > 0
                                    THEN ROUND( (a.sum_rarity_genre - oldc.sum_rarity_genre) / (a.votes_count - 1)::numeric, 2) 
                                ELSE 0 END,
            rarity_performance_avg = CASE 
                                        WHEN (a.votes_count - 1) > 0
                                        THEN ROUND( (a.sum_rarity_performance - oldc.sum_rarity_performance) / (a.votes_count - 1)::numeric, 2) 
                                    ELSE 0 END,
            rarity_avg = CASE 
                            WHEN (a.votes_count - 1) > 0
                            THEN ROUND( ((a.sum_rarity_genre - oldc.sum_rarity_genre) 
                                        + (a.sum_rarity_performance - oldc.sum_rarity_performance)) / (a.votes_count - 1)::numeric, 2) 
                            ELSE 0 END,

            format_release_score_avg = CASE 
                                            WHEN (a.votes_count - 1) > 0
                                            THEN ROUND( (a.sum_format_release_score - oldc.sum_format_release_score)::numeric / (a.votes_count - 1)::numeric, 2) 
                                    ELSE 0 END,
            integrity_genre_avg = CASE 
                                    WHEN (a.votes_count - 1) > 0
                                    THEN ROUND( (a.sum_integrity_genre - oldc.sum_integrity_genre) / (a.votes_count - 1)::numeric, 2) 
                                ELSE 0 END,
            integrity_semantic_avg = CASE 
                                        WHEN (a.votes_count - 1) > 0
                                        THEN ROUND( (a.sum_integrity_semantic - oldc.sum_integrity_semantic) / (a.votes_count - 1)::numeric, 2) 
                                    ELSE 0 END,
            integrity_avg = CASE 
                                WHEN (a.votes_count - 1) > 0
                                THEN ROUND( ((a.sum_format_release_score - oldc.sum_format_release_score)::numeric
                                    + (a.sum_integrity_genre - oldc.sum_integrity_genre)
                                    + (a.sum_integrity_semantic - oldc.sum_integrity_semantic)) / (a.votes_count - 1)::numeric, 2) 
                            ELSE 0 END,

            depth_avg = CASE 
                            WHEN (a.votes_count - 1) > 0
                            THEN ROUND( (a.sum_depth - oldc.sum_depth)::numeric / (a.votes_count - 1)::numeric, 2) 
                        ELSE 0 END,

            quality_rhymes_images_avg = CASE 
                                            WHEN (a.votes_count - 1) > 0
                                            THEN ROUND( (a.sum_quality_rhymes_images - oldc.sum_quality_rhymes_images)::numeric / (a.votes_count - 1)::numeric, 2) 
                                        ELSE 0 END,
            quality_structure_rhythm_avg = CASE 
                                                WHEN (a.votes_count - 1) > 0
                                                THEN ROUND( (a.sum_quality_structure_rhythm - oldc.sum_quality_structure_rhythm)::numeric / (a.votes_count - 1)::numeric, 2) 
                                            ELSE 0 END,
            quality_style_impl_avg = CASE 
                                        WHEN (a.votes_count - 1) > 0
                                        THEN ROUND( (a.sum_quality_style_impl - oldc.sum_quality_style_impl)::numeric / (a.votes_count - 1)::numeric, 2) 
                                    ELSE 0 END,
            quality_individuality_avg = CASE 
                                            WHEN (a.votes_count - 1) > 0
                                            THEN ROUND( (a.sum_quality_individuality - oldc.sum_quality_individuality)::numeric / (a.votes_count - 1)::numeric, 2) 
                                        ELSE 0 END,
            quality_points_avg = CASE 
                                    WHEN (a.votes_count - 1) > 0
                                    THEN ROUND( (a.sum_quality_points - oldc.sum_quality_points)::numeric / (a.votes_count - 1)::numeric, 2) 
                                ELSE 0 END,
            quality_factor_avg = CASE 
                                    WHEN (a.votes_count - 1) > 0
                                    THEN ROUND( (a.sum_quality_factor - oldc.sum_quality_factor) / (a.votes_count - 1)::numeric, 4) 
                                ELSE 0 END,

            influence_author_popularity_avg = CASE 
                                                WHEN (a.votes_count - 1) > 0
                                                THEN ROUND( (a.sum_influence_author_popularity - oldc.sum_influence_author_popularity) / (a.votes_count - 1)::numeric, 2) 
                                            ELSE 0 END,
            influence_release_anticip_avg = CASE 
                                                WHEN (a.votes_count - 1) > 0
                                                THEN ROUND( (a.sum_influence_release_anticip - oldc.sum_influence_release_anticip) / (a.votes_count - 1)::numeric, 2) 
                                            ELSE 0 END,
            influence_points_avg = CASE 
                                    WHEN (a.votes_count - 1) > 0
                                    THEN ROUND( (a.sum_influence_points - oldc.sum_influence_points) / (a.votes_count - 1)::numeric, 2) 
                                  ELSE 0 END,
            influence_multiplier_avg = CASE 
                                        WHEN (a.votes_count - 1) > 0
                                        THEN ROUND( (a.sum_influence_multiplier - oldc.sum_influence_multiplier) / (a.votes_count - 1)::numeric, 2) 
                                    ELSE 0 END,

            core_sum_avg = CASE 
                                WHEN (a.votes_count - 1) > 0
                                THEN ROUND( (a.sum_core - oldc.sum_core) / (a.votes_count - 1)::numeric, 2) 
                            ELSE 0 END,
            value_avg = CASE 
                            WHEN (a.votes_count - 1) > 0
                            THEN ROUND( (a.sum_final_value - oldc.sum_final_value) / (a.votes_count - 1)::numeric, 2) 
                        ELSE 0 END
        FROM oldc
        WHERE a.release_id = OLD.release_id;

        DELETE FROM "Album_value_aggregate"
        WHERE release_id = OLD.release_id AND votes_count <= 0;

        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$;