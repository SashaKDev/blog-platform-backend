import { PostDocument } from '../../domain/post.entity';

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
    myStatus: LikesStatuses;
    newestLikes: NewestLikesType[];
  };

  static mapToView(
    post: PostDocument,
    newestLikes: NewestLikesType[],
  ): PostViewDto {
    const dto = new PostViewDto();

    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.createdAt = post.createdAt.toISOString();
    dto.blogName = post.blogName;
    dto.extendedLikesInfo = {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      myStatus: LikesStatuses.None, //TODO change after adding bearer auth
      newestLikes: newestLikes,
    };

    return dto;
  }

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

export enum LikesStatuses {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export type NewestLikesType = {
  addedAt: string;
  userId: string;
  login: string;
};
