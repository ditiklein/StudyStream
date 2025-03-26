namespace Study.API.Models
{
    public class FolderPostModel
    {
        public string Name { get; set; }  // שם התיקיה


        public int OwnerId { get; set; }  // בעל התיקיה
        public int? ParentFolderId { get; set; }

    }
}
