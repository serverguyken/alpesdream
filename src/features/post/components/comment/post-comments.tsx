import Avatar from "boring-avatars";
import { usePostComments } from "@post/hooks";

import CommentBox from "./comment-box";
import CommentForm from "./comment-form";
import SpinLoader from "@common/components/svg/spin-loader";
import { forwardRef } from "react";

type PostCommentsProps = {
  slug: string;
  children?: React.ReactNode;
};

const PostComments = forwardRef<HTMLHeadingElement, PostCommentsProps>(
  function PostComments({ slug }, ref) {
    const { comments, isLoading, isError } = usePostComments(slug);

    if (isLoading) {
      return (
        <div className="my-12 flex gap-6 flex-col justify-center items-center">
          <SpinLoader />
          <div>Loading comments...</div>
        </div>
      );
    }
    if (isError) {
      return (
        <div className="my-12 flex gap-6 flex-col justify-center items-center text-red-600">
          Error loading comments
        </div>
      );
    }
    return (
      <section className="my-12 max-w-4xl lg:my-20 mx-auto">
        <div className="space-y-3 md:space-y-6">
          <h3
            className="text-xl font-heading tracking-wider md:text-2xl lg:text-3xl"
            ref={ref}
          >
            Comments({comments.length})
          </h3>
          {comments &&
            comments.map((comment) => (
              <div
                key={comment.id}
                className="shadow p-2 lg:p-4 rounded-md border dark:border-mint/30 border-opacity-50"
              >
                <div className="flex gap-4">
                  <div className="mt-0.5">
                    <Avatar
                      size={30}
                      name={comment.user.email}
                      variant="beam"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full rounded-md relative">
                    <CommentBox
                      username={comment.user.username}
                      createdAt={comment.createdAt}
                      isAdmin={false}
                    />

                    <p className="p-2">{comment.content}</p>
                    {comment.reply && (
                      <div className="ml-10 my-6">
                        <CommentBox
                          username={comment.reply.to}
                          createdAt={comment.reply.createdAt}
                          by={comment.reply.by}
                          isAdmin
                        />
                        <p className="text-lg p-2">{comment.reply.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="my-4 lg:my-16 space-y-3 md:space-y-6">
          <h3 className="text-xl font-heading tracking-wider md:text-2xl">
            Questions? Thoughts? Welcome to drop a comment below!
          </h3>
          <CommentForm postSlug={slug} />
        </div>
      </section>
    );
  }
);

export default PostComments;
