import { PostDocument } from '../../domain/post.entity';
import { PostLikeDocument } from '../../../likes/posts-likes/domain/post-like.entity';
import { UserPayloadDto } from '../../../../user-accounts/auth/guards/local/dto/user-payload.dto';
import { LikeStatuses } from '../../../../../core/enums/like-statuses.enum';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatuses;
    newestLikes: NewestLikesType[];
  } = {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatuses.None,
    newestLikes: [],
  };

  static mapToView(
    post: PostDocument,
    postLikes?: PostLikeDocument[],
    user?: UserPayloadDto,
  ): PostViewDto {
    const likesCount = postLikes
      ? postLikes.filter((l) => l.status === LikeStatuses.Like).length
      : 0;
    const dislikesCount = postLikes
      ? postLikes.filter((l) => l.status === LikeStatuses.Dislike).length
      : 0;
    const myStatus =
      user && postLikes
        ? (postLikes.find((l) => l.userId === user.userId)?.status ??
          LikeStatuses.None)
        : LikeStatuses.None;
    const newestLikes: NewestLikesType[] = postLikes
      ? postLikes
          .filter((l) => l.status === LikeStatuses.Like)
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .slice(0, 3)
          .map((l) => ({
            addedAt: l.updatedAt.toISOString(),
            userId: l.userId,
            login: l.userLogin,
          }))
      : [];

    const dto = new PostViewDto();

    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();
    dto.extendedLikesInfo.likesCount = likesCount;
    dto.extendedLikesInfo.dislikesCount = dislikesCount;
    dto.extendedLikesInfo.myStatus = myStatus;
    dto.extendedLikesInfo.newestLikes = newestLikes;

    return dto;

    // static mapToViewRefactored(
    //   post: PostDocument,
    //   newestLikes: NewestLikesType[],
    // ): PostViewDto {
    //   const dto = new PostViewDto();
    //
    //   dto.id = post._id.toString();
    //   dto.title = post.title;
    //   dto.shortDescription = post.shortDescription;
    //   dto.content = post.content;
    //   dto.blogId = post.blogId;
    //   dto.createdAt = post.createdAt.toISOString();
    //   dto.blogName = blogName;
    //   dto.extendedLikesInfo = {
    //     likesCount: post.likesCount,
    //     dislikesCount: post.dislikesCount,
    //     myStatus: LikesStatuses.None, //TODO change after adding bearer auth
    //     newestLikes: newestLikes,
    //   };
    //
    //   return dto;
    // }
  }
}

export type NewestLikesType = {
  addedAt: string;
  userId: string;
  login: string;
};
