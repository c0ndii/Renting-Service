﻿using AutoMapper;
using Azure;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Models;

namespace RentingServiceBackend
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<User, UserDto>();
            CreateMap<Comment, CommentDto>()
                .ForMember(x => x.User, y => y.MapFrom(z => new UserDto() { Name = z.User.Name, UserId = z.User.UserId }));
            CreateMap<Feature, string>()
                .ConvertUsing(x => x.FeatureName);
            CreateMap<RegisterUserDto, User>()
                //.ForMember(x => x.RoleId, y => y.MapFrom(z => 1))
                .ForMember(x => x.FollowedPosts, y => y.MapFrom(z => new List<Post>()))
                .ForMember(x => x.Comments, y => y.MapFrom(z => new List<Comment>()))
                .ForMember(x => x.Reservations, y => y.MapFrom(z => new List<Reservation>()))
                .ForMember(x => x.OwnedPosts, y => y.MapFrom(z => new List<Post>()));
            CreateMap<ForRentPost, ForRentPostDto>()
                .ForMember(x => x.Rate, y => y.MapFrom(z => z.RateScore / z.RateIterator))
                .ForMember(x => x.FollowCount, y => y.MapFrom(z => z.FollowedBy.Count))
                .ForMember(x => x.MainCategory, y => y.MapFrom(z => z.MainCategory.MainCategoryName))
                .IncludeMembers();
                //.ForMember(x => x.Comments, y => y.MapFrom(z => z))
                //.ForMember(x => x.Features, y=> y.MapFrom(z => z))
            CreateMap<ForSalePost, ForSalePostDto>()
                .ForMember(x => x.FollowCount, y => y.MapFrom(z => z.FollowedBy.Count))
                .ForMember(x => x.MainCategory, y => y.MapFrom(z => z.MainCategory.MainCategoryName))
                .IncludeMembers();
            CreateMap<Post, PostDto>()
                .ForMember(x => x.FollowCount, y => y.MapFrom(z => z.FollowedBy.Count))
                .IncludeMembers();
            CreateMap<ForRentPost, PostDto>()
                .ForMember(x => x.Rate, y => y.MapFrom(z => z.RateScore / z.RateIterator))
                .ForMember(x => x.FollowCount, y => y.MapFrom(z => z.FollowedBy.Count))
                .ForMember(x => x.MainCategory, y => y.MapFrom(z => z.MainCategory.MainCategoryName))
                .IncludeMembers();
            CreateMap<ForSalePost, PostDto>()
                .ForMember(x => x.FollowCount, y => y.MapFrom(z => z.FollowedBy.Count))
                .ForMember(x => x.MainCategory, y => y.MapFrom(z => z.MainCategory.MainCategoryName))
                .IncludeMembers();
        }
    }
}
