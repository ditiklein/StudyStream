using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Study.Data.Migrations
{
    /// <inheritdoc />
    public partial class with : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_FolderList_FolderId",
                table: "Lessons");

            migrationBuilder.AlterColumn<int>(
                name: "FolderId",
                table: "Lessons",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_FolderList_FolderId",
                table: "Lessons",
                column: "FolderId",
                principalTable: "FolderList",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_FolderList_FolderId",
                table: "Lessons");

            migrationBuilder.AlterColumn<int>(
                name: "FolderId",
                table: "Lessons",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_FolderList_FolderId",
                table: "Lessons",
                column: "FolderId",
                principalTable: "Folders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
