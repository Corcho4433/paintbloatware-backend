import type { Post } from "@prisma/client";
import { db } from "../db/db";

export interface PostBody {
	source: string;
	image: string;
	description: string;
	tags: string[];
	id_user: string;
}

export const getPosts = async ({ page, userId }: { page: number; userId?: string }) => {
	const pageSize = 12;
	
	const [posts, totalCount] = await Promise.all([
		db.post.findMany({
			orderBy:{ created_at: 'desc' },
			skip: (page - 1) * pageSize,
			take: pageSize,
			select: {
				id: true,
				url_bucket: true,
				content: true,
				description: true,
				created_at: true,
				edited: true,
				user: {
					select: {
						name: true,
						id: true,
						urlPfp: true
					},
				},
				_count: {
					select: {
						comments: true,
					
					},
				},
				TagsForPost: {
					select: {
						tag: {
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			},
		}),
		db.post.count()
	]);

	// Get rating sums and user ratings for all posts in parallel
	const postsWithRatings = await Promise.all(
		posts.map(async (post) => {
			const [ratingResult, userRating] = await Promise.all([
				db.ratings.aggregate({
					where: {
						id_post: post.id,
					},
					_sum: {
						value: true,
					},
				}),
				// Solo buscar rating del usuario si está logueado
				userId ? db.ratings.findFirst({
					where: {
						id_post: post.id,
						id_user: userId,
					},
					select: {
						value: true,
					},
				}) : Promise.resolve(null)
			]);

			return {
				...post,
				rating: ratingResult._sum.value || 0,
				ratingValue: userRating?.value || 0 // 1, -1, o 0
			};
		})
	);

	const maxPages = Math.ceil(totalCount / pageSize);

	return {
		posts: postsWithRatings,
		maxPages,
		currentPage: page,
		totalCount
	};
};

export const getPostsRandomized = async ({ page, userId }: { page: number; userId?: string }) => {
  const pageSize = 12;
  
  const likedPostIds = userId ? await db.ratings.findMany({
    where: {
      id_user: userId,
      value: 1
    },
    select: {
      id_post: true
    }
  }).then(ratings => ratings.map(r => r.id_post)) : [];

  const totalCount = await db.post.count();
  
  // Generate random offset instead of sequential pagination
  const maxOffset = Math.max(0, totalCount - (pageSize * 3));
  const randomOffset = Math.floor(Math.random() * (maxOffset + 1));
  
  const posts = await db.post.findMany({
    skip: randomOffset, // Offset aleatorio en lugar de paginación secuencial
    take: pageSize * 3,
    select: {
      id: true,
      url_bucket: true,
      content: true,
      description: true,
      created_at: true,
      edited: true,
      user: {
        select: {
          name: true,
          id: true,
          urlPfp: true
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
      TagsForPost: {
        select: {
          tag: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
  });

  // ... resto del código igual
  const postsWithRatings = await Promise.all(
    posts.map(async (post) => {
      const [ratingResult, userRating] = await Promise.all([
        db.ratings.aggregate({
          where: {
            id_post: post.id,
          },
          _sum: {
            value: true,
          },
        }),
        userId ? db.ratings.findFirst({
          where: {
            id_post: post.id,
            id_user: userId,
          },
          select: {
            value: true,
          },
        }) : Promise.resolve(null)
      ]);
      return {
        ...post,
        rating: ratingResult._sum.value || 0,
        ratingValue: userRating?.value || 0,
        isLiked: likedPostIds.includes(post.id)
      };
    })
  );

  const nonLikedPosts = postsWithRatings.filter(p => !p.isLiked);
  const likedPosts = postsWithRatings.filter(p => p.isLiked);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
			//@ts-ignore
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const shuffledNonLiked = shuffleArray(nonLikedPosts);
  const shuffledLiked = shuffleArray(likedPosts);
  const combinedPosts = [...shuffledNonLiked, ...shuffledLiked];
  
  const paginatedPosts = combinedPosts.slice(0, pageSize);
  
  // Para paginación aleatoria, las páginas no tienen mucho sentido
  // Podrías retornar un estimado o simplemente indicar si hay más posts
  const hasMore = totalCount > pageSize;
  
  return {
    posts: paginatedPosts,
    maxPages: Math.ceil(totalCount / pageSize), // Estimado
    currentPage: page,
    totalCount,
    hasMore
  };
};

export const deletePost = async (postId: string, userId: string) => {
	return await db.post.delete({
		where: {
			id: postId,
			id_user: userId
		}
	})
}

export const getPostsByUser = async ({ userID, page, loggedUserId }: { userID: string; page: number; loggedUserId?: string }) => {
	const pageSize = 12;

	const [posts, totalCount] = await Promise.all([
		db.post.findMany({
			where: {
				id_user: userID,
			},
			orderBy: {
				created_at: "desc"
			},
			skip: (page - 1) * pageSize,
			take: pageSize,
			select: {
				id: true,
				url_bucket: true,
				content: true,
				description: true,
				edited: true,
				created_at: true,
				user: {
					select: {
						name: true,
						id: true,
						urlPfp: true
					},
				},
				_count: {
					select: {
						comments: true,
					},
				},
				TagsForPost: {
					select: {
						tag: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
			},
		}),
		db.post.count({
			where: {
				id_user: userID,
			}
		})
	]);

	// Get rating sums for all posts in parallel
	const postsWithRatings = await Promise.all(
		posts.map(async (post) => {
			const [ratingResult, userRating] = await Promise.all([
				db.ratings.aggregate({
					where: {
						id_post: post.id,
					},
					_sum: {
						value: true,
					},
				}),
				// Solo buscar rating del usuario si está logueado
				loggedUserId ? db.ratings.findFirst({
					where: {
						id_post: post.id,
						id_user: loggedUserId,
					},
					select: {
						value: true,
					},
				}) : Promise.resolve(null)
			]);

			return {
				...post,
				rating: ratingResult._sum.value || 0,
				ratingValue: userRating?.value || 0 // 1, -1, o 0
			};
		})
	);

	const maxPages = Math.ceil(totalCount / pageSize);

	return {
		posts: postsWithRatings,
		maxPages,
		currentPage: page,
		totalCount
	};
};

export const getPostById = async ({PostID, userId}: {PostID: string, userId?: string}) => {
	const [post, ratingResult, userRating] = await Promise.all([
		db.post.findFirst({
			select: {
				id: true,
				content: true,
				url_bucket: true,
				created_at: true,
				description: true,
				edited: true,
				TagsForPost: {
					select: {
						tag: {
							select: {
								id: true,
								name: true,
							}
						}
					}
				},
				user: {
					select: {
						name: true,
						urlPfp: true,
						id: true,
					},
				},
				comments: {
					select: {
						id: true,
						content: true,
						user: {
							select: {
								name: true,
								id: true,
							},
						},
					},
				},
			},
			where: {
				id: PostID,
			},
		}),
		db.ratings.aggregate({
			where: {
				id_post: PostID,
			},
			_sum: {
				value: true,
			},
		}),
		// Solo buscar rating del usuario si está logueado
		userId ? db.ratings.findFirst({
			where: {
				id_post: PostID,
				id_user: userId,
			},
			select: {
				value: true,
			},
		}) : Promise.resolve(null)
	]);

	if (!post) {
		return null;
	}

	return {
		...post,
		rating: ratingResult._sum.value || 0,
		ratingValue: userRating?.value || 0 // 1, -1, o 0
	};
};


export const createPost = async (post: PostBody) => {
	const { tags } = post;
	
	// Validar que todas las tags existan antes de crear el post
	let tagIds: string[] = [];
	if (tags && tags.length > 0) {
		tagIds = await Promise.all(
			tags.map(async (tagName) => {
				// Buscar si la tag ya existe
				const tag = await db.tags.findFirst({
					where: {
						name: {
							equals: tagName,
							mode: 'insensitive' // Case-insensitive
						}
					}
				});

				// Si no existe, lanzar error (no se crea el post)
				if (!tag) {
					throw new Error(`Tag "${tagName}" no encontrada`);
				}

				return tag.id;
			})
		);
	}

	// Si llegamos aquí, todas las tags son válidas, proceder a crear el post
	const postResult = await db.post.create({
		data: {
			description: post.description,
			content: post.source,
			id_user: post.id_user,
			url_bucket: post.image,
		},
	});

	if (!postResult) {
		throw new Error("Failed to create post");
	}

	// Crear las relaciones con las tags
	if (tagIds.length > 0) {
		await db.tagsForPost.createMany({
			data: tagIds.map((tagId) => ({
				id_post: postResult.id,
				id_tag: tagId,
			})),
		});
	}

	return postResult;
};

export const getPostRatingInteractions = async (post_id: string) => {
	return await db.ratings.count({
		where: {
			id_post: post_id,
		}
	})
}

export const getPostRating = async (post_id: string) => {
	const posts = await db.ratings.findMany({
		where: {
			id_post: post_id,
		}
	})

	let total_like_count: number = 0;
	posts.forEach((rating) => {
		total_like_count += rating.value;
	})

	return total_like_count;
}

export const getPostsByTag = async (tagName: string, { page = 1 }: { page?: number } = {}) => {
	const pageSize = 12;
	
	const [posts, totalCount] = await Promise.all([
		db.post.findMany({
			skip: (page - 1) * pageSize,
			take: pageSize,
			where: {
				TagsForPost: {
					some: {
						tag: {
							name: {
								equals: tagName,
								mode: 'insensitive' // Para búsqueda case-insensitive
							}
						}
					}
				}
			},
			select: {
				id: true,
				url_bucket: true,
				content: true,
				description: true,
				created_at: true,
				edited: true,
				user: {
					select: {
						name: true,
						id: true,
						urlPfp: true
					},
				},
				_count: {
					select: {
						comments: true,
						ratings: true
					},
				},
				TagsForPost: {
					select: {
						tag: {
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			},
			orderBy: {
				created_at: 'desc'
			}
		}),
		db.post.count({
			where: {
				TagsForPost: {
					some: {
						tag: {
							name: {
								equals: tagName,
								mode: 'insensitive'
							}
						}
					}
				}
			}
		})
	]);

	const totalPages = Math.ceil(totalCount / pageSize);

	return {
		posts,
		pagination: {
			currentPage: page,
			totalPages,
			totalCount,
			hasNextPage: page < totalPages,
			hasPreviousPage: page > 1
		}
	};
};

