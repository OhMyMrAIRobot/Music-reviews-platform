CREATE OR REPLACE TRIGGER trg_update_release_rating
AFTER INSERT OR UPDATE OR DELETE ON "Reviews"
FOR EACH ROW
EXECUTE FUNCTION update_release_rating();


CREATE TRIGGER fav_review_points_trigger
    AFTER INSERT OR DELETE ON "User_fav_reviews"
    FOR EACH ROW
EXECUTE FUNCTION handle_fav_review_points();


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


CREATE TRIGGER review_points_insert_update
    AFTER INSERT OR UPDATE OF text ON "Reviews"
    FOR EACH ROW
EXECUTE FUNCTION handle_review_points();


CREATE TRIGGER review_points_delete
    AFTER DELETE ON "Reviews"
    FOR EACH ROW
EXECUTE FUNCTION handle_review_points();


CREATE TRIGGER fav_media_points_trigger
    AFTER INSERT OR DELETE ON "User_fav_media"
    FOR EACH ROW
EXECUTE FUNCTION handle_fav_media_points();


CREATE TRIGGER trg_album_value_votes_aggregate
    AFTER INSERT OR UPDATE OR DELETE
    ON "Album_value_votes"
    FOR EACH ROW
EXECUTE FUNCTION trg_album_value_votes_aggregate();

CREATE TRIGGER author_comment_points_trigger
    AFTER INSERT OR DELETE ON "Album_value_votes"
    FOR EACH ROW
EXECUTE FUNCTION handle_points(70);