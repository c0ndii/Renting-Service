using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentingServiceBackend.Migrations
{
    /// <inheritdoc />
    public partial class userPicture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Posts",
                newName: "Lng");

            migrationBuilder.AddColumn<string>(
                name: "Picture",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Lat",
                table: "Posts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Picture",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Lat",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "Lng",
                table: "Posts",
                newName: "Location");
        }
    }
}
