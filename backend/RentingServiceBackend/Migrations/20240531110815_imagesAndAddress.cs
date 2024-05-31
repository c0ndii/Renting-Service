using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentingServiceBackend.Migrations
{
    /// <inheritdoc />
    public partial class imagesAndAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Image",
                table: "Posts",
                newName: "Street");

            migrationBuilder.AddColumn<string>(
                name: "BuildingNumber",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Images",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuildingNumber",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "District",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "Images",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "Street",
                table: "Posts",
                newName: "Image");
        }
    }
}
