//namespace Study.API.Models
//{
//    public class ShareLessonPostModle
//    {

//            public int LessonId { get; set; }
//            public string Email { get; set; }


//    }
//}


namespace Study.API.Models
{
    public class ShareLessonPostModle
    {
        public int LessonId { get; set; }
        public string Email { get; set; }
        public bool IsPublic { get; set; } = false;  // האם הקישור פתוח לכל או רק למייל המיועד
    }

    public class AccessRequestModel
    {
        public string Token { get; set; }  // Token of the shared lesson
        public string Email { get; set; }  // Email requesting access
    }

    public class ApproveAccessModel
    {
        public string RequestToken { get; set; }  // Access request token
        public bool Approved { get; set; }  // Whether access is approved
    }
    public class VerificationRequest
    {
        public string Token { get; set; }
        public string Email { get; set; }
    }

    public class VerificationCodeRequest
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public string Code { get; set; }
    }

}
