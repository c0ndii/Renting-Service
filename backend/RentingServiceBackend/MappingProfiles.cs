using AutoMapper;
using Azure;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Models;

namespace RentingServiceBackend
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            //CreateMap<Post, PostDto>();
            CreateMap<RegisterUserDto, User>()
                //.ForMember(x => x.RoleId, y => y.MapFrom(z => 1))
                .ForMember(x => x.FollowedPosts, y => y.MapFrom(z => new List<Post>()))
                .ForMember(x => x.Comments, y => y.MapFrom(z => new List<Comment>()))
                .ForMember(x => x.Reservations, y => y.MapFrom(z => new List<Reservation>()))
                .ForMember(x => x.OwnedPosts, y => y.MapFrom(z => new List<Post>()));
        }
    }
}
