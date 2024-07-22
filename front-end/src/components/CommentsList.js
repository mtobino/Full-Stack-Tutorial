const CommentsList = ({ comments }) => (
    <>
        <h3>Comments</h3>
        {
            comments.map((comment, i) => (
                <div key={i} className={"comment"}>
                    <h4>{comment.postedBy}</h4>
                    <p>{comment.text}</p>
                </div>
            ))
        }
    </>
);

export default CommentsList;