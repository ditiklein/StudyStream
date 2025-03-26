using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Study.Data.Migrations
{
    /// <inheritdoc />
    public partial class FK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FolderList_FolderList_ParentFolderId",
                table: "FolderList");

            migrationBuilder.DropForeignKey(
                name: "FK_FolderList_Users_OwnerId",
                table: "FolderList");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_FolderList_FolderId",
                table: "Lessons");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FolderList",
                table: "FolderList");

            migrationBuilder.RenameTable(
                name: "FolderList",
                newName: "Folders");

            migrationBuilder.RenameIndex(
                name: "IX_FolderList_ParentFolderId",
                table: "Folders",
                newName: "IX_Folders_ParentFolderId");

            migrationBuilder.RenameIndex(
                name: "IX_FolderList_OwnerId",
                table: "Folders",
                newName: "IX_Folders_OwnerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Folders",
                table: "Folders",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Folders_Folders_ParentFolderId",
                table: "Folders",
                column: "ParentFolderId",
                principalTable: "Folders",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Folders_Users_OwnerId",
                table: "Folders",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Folders_FolderId",
                table: "Lessons",
                column: "FolderId",
                principalTable: "Folders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);  // הוספת Cascade למחיקת שיעורים אוטומטית
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Folders_Folders_ParentFolderId",
                table: "Folders");

            migrationBuilder.DropForeignKey(
                name: "FK_Folders_Users_OwnerId",
                table: "Folders");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Folders_FolderId",
                table: "Lessons");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Folders",
                table: "Folders");

            migrationBuilder.RenameTable(
                name: "Folders",
                newName: "FolderList");

            migrationBuilder.RenameIndex(
                name: "IX_Folders_ParentFolderId",
                table: "FolderList",
                newName: "IX_FolderList_ParentFolderId");

            migrationBuilder.RenameIndex(
                name: "IX_Folders_OwnerId",
                table: "FolderList",
                newName: "IX_FolderList_OwnerId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FolderList",
                table: "FolderList",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FolderList_FolderList_ParentFolderId",
                table: "FolderList",
                column: "ParentFolderId",
                principalTable: "FolderList",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FolderList_Users_OwnerId",
                table: "FolderList",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_FolderList_FolderId",
                table: "Lessons",
                column: "FolderId",
                principalTable: "FolderList",
                principalColumn: "Id");
        }
    }
}
