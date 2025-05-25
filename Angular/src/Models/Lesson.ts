export class Lesson{
    constructor(
       public id: number,
       public lessonName?: string,
       public description?: string,
       public  fileType?: string,
       public  urlName?: string,
        public  folderId?: number,
        public ownerId?: number,
        public createdAt?: string, // ISO date
        public updatedAt?: string,
        public isDeleted?: boolean,
      

    ){}
} 
