using AutoMapper;
using Study.API.Models;
using Study.Core.DTOs;
using Study.Core.Entities;

namespace Study.API
{
    public class MappingProfilePost:Profile
    {
        public MappingProfilePost()
        {
            CreateMap<UserPostModel, UserDTO>().ReverseMap();
            CreateMap<LessonPostModel, LessonDTO>().ReverseMap();
            CreateMap<FolderPostModel, FolderDTO>().ReverseMap();
            CreateMap<TranscriptPostModel, TranscriptDTO>().ReverseMap();
            CreateMap<RegisterModel, UserDTO>().ReverseMap();
            CreateMap<MessagePostModel, MessageDTO>().ReverseMap();


        }

    }
}
