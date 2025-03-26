using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Study.Data.Migrations
{
    /// <inheritdoc />
    public partial class withFolder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Categories_CategoryId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Users_UserId",
                table: "Lessons");

            migrationBuilder.DropTable(
                name: "CategoryUser");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_CategoryId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Lessons");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Lessons",
                newName: "OwnerId");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "Lessons",
                newName: "FolderId");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Lessons",
                newName: "Url");

            migrationBuilder.RenameColumn(
                name: "LessonUrl",
                table: "Lessons",
                newName: "LessonName");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Lessons",
                newName: "FileType");

            migrationBuilder.RenameIndex(
                name: "IX_Lessons_UserId",
                table: "Lessons",
                newName: "IX_Lessons_OwnerId");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Lessons",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "FolderList",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParentFolderId = table.Column<int>(type: "int", nullable: true),
                    OwnerId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FolderList", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FolderList_FolderList_ParentFolderId",
                        column: x => x.ParentFolderId,
                        principalTable: "FolderList",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_FolderList_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade); // מחיקה אוטומטית של תיקיות
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_FolderId",
                table: "Lessons",
                column: "FolderId");

            migrationBuilder.CreateIndex(
                name: "IX_FolderList_OwnerId",
                table: "FolderList",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_FolderList_ParentFolderId",
                table: "FolderList",
                column: "ParentFolderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_FolderList_FolderId",
                table: "Lessons",
                column: "FolderId",
                principalTable: "FolderList",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Users_OwnerId",
                table: "Lessons",
                column: "OwnerId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict); // מניעת מחיקה מעגלית
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_FolderList_FolderId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Users_OwnerId",
                table: "Lessons");

            migrationBuilder.DropTable(
                name: "FolderList");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_FolderId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Lessons");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "Lessons",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "Lessons",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "LessonName",
                table: "Lessons",
                newName: "LessonUrl");

            migrationBuilder.RenameColumn(
                name: "FolderId",
                table: "Lessons",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "FileType",
                table: "Lessons",
                newName: "Description");

            migrationBuilder.RenameIndex(
                name: "IX_Lessons_OwnerId",
                table: "Lessons",
                newName: "IX_Lessons_UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Users_UserId",
                table: "Lessons",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
