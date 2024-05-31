using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentingServiceBackend.Migrations
{
    /// <inheritdoc />
    public partial class PostPicturePath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Images",
                table: "Posts",
                newName: "PicturesPath");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PicturesPath",
                table: "Posts",
                newName: "Images");
        }
    }
}
