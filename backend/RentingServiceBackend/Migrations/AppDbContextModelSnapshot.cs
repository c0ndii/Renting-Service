﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using RentingServiceBackend.Entities;

#nullable disable

namespace RentingServiceBackend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("RentingServiceBackend.Entities.Comment", b =>
                {
                    b.Property<int>("CommentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CommentId"));

                    b.Property<string>("CommentText")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("CommentTime")
                        .HasColumnType("datetime2");

                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("CommentId");

                    b.HasIndex("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.Feature", b =>
                {
                    b.Property<int>("FeatureId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("FeatureId"));

                    b.Property<string>("FeatureName")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.HasKey("FeatureId");

                    b.ToTable("Features");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.MainCategory", b =>
                {
                    b.Property<int>("MainCategoryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("MainCategoryId"));

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(21)
                        .HasColumnType("nvarchar(21)");

                    b.Property<string>("MainCategoryName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("MainCategoryId");

                    b.ToTable("MainCategories");

                    b.HasDiscriminator<string>("Discriminator").HasValue("MainCategory");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.Post", b =>
                {
                    b.Property<int>("PostId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PostId"));

                    b.Property<DateTime>("AddDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("BuildingNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Confirmed")
                        .HasColumnType("bit");

                    b.Property<string>("Country")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(13)
                        .HasColumnType("nvarchar(13)");

                    b.Property<string>("District")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Lat")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Lng")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PicturesPath")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<float>("Price")
                        .HasColumnType("real");

                    b.Property<float>("SquareFootage")
                        .HasColumnType("real");

                    b.Property<string>("Street")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("Posts");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Post");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.PostFeatureLinkEntity", b =>
                {
                    b.Property<int>("FeatureId")
                        .HasColumnType("int");

                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.HasKey("FeatureId", "PostId");

                    b.HasIndex("PostId");

                    b.ToTable("PostFeature");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.PostUserFollowLinkEntity", b =>
                {
                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("PostId", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("PostUser");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.Reservation", b =>
                {
                    b.Property<int>("ReservationId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ReservationId"));

                    b.Property<DateTime>("FromDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("PostId")
                        .HasColumnType("int");

                    b.Property<int>("ReservationFlag")
                        .HasColumnType("int");

                    b.Property<DateTime>("ToDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("ReservationId");

                    b.HasIndex("PostId");

                    b.HasIndex("UserId");

                    b.ToTable("Reservations");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleId"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserId"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordResetToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Picture")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("RefreshTokenTimeExpires")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("ResetPasswordTimeExpires")
                        .HasColumnType("datetime2");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<string>("VerificationToken")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.HasIndex("RoleId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.ForRentMainCategory", b =>
                {
                    b.HasBaseType("RentingServiceBackend.Entities.MainCategory");

                    b.HasDiscriminator().HasValue("ForRentMainCategory");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.ForSaleMainCategory", b =>
                {
                    b.HasBaseType("RentingServiceBackend.Entities.MainCategory");

                    b.HasDiscriminator().HasValue("ForSaleMainCategory");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.ForRentPost", b =>
                {
                    b.HasBaseType("RentingServiceBackend.Entities.Post");

                    b.Property<int>("MainCategoryId")
                        .HasColumnType("int");

                    b.Property<int>("RateIterator")
                        .HasColumnType("int");

                    b.Property<double>("RateScore")
                        .HasColumnType("float");

                    b.Property<int>("SleepingPlaceCount")
                        .HasColumnType("int");

                    b.HasIndex("MainCategoryId");

                    b.ToTable("Posts", t =>
                        {
                            t.Property("MainCategoryId")
                                .HasColumnName("ForRentPost_MainCategoryId");
                        });

                    b.HasDiscriminator().HasValue("ForRentPost");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.ForSalePost", b =>
                {
                    b.HasBaseType("RentingServiceBackend.Entities.Post");

                    b.Property<int>("MainCategoryId")
                        .HasColumnType("int");

                    b.HasIndex("MainCategoryId");

                    b.HasDiscriminator().HasValue("ForSalePost");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.Comment", b =>
                {
                    b.HasOne("RentingServiceBackend.Entities.ForRentPost", "Post")
                        .WithMany("Comments")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RentingServiceBackend.Entities.User", "User")
                        .WithMany("Comments")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.Post", b =>
                {
                    b.HasOne("RentingServiceBackend.Entities.User", "User")
                        .WithMany("OwnedPosts")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.PostFeatureLinkEntity", b =>
                {
                    b.HasOne("RentingServiceBackend.Entities.Feature", null)
                        .WithMany()
                        .HasForeignKey("FeatureId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RentingServiceBackend.Entities.ForRentPost", null)
                        .WithMany()
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.PostUserFollowLinkEntity", b =>
                {
                    b.HasOne("RentingServiceBackend.Entities.Post", null)
                        .WithMany()
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("RentingServiceBackend.Entities.User", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.Reservation", b =>
                {
                    b.HasOne("RentingServiceBackend.Entities.ForRentPost", "Post")
                        .WithMany("Reservations")
                        .HasForeignKey("PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("RentingServiceBackend.Entities.User", "User")
                        .WithMany("Reservations")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Post");

                    b.Navigation("User");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.User", b =>
                {
                    b.HasOne("RentingServiceBackend.Entities.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.ForRentPost", b =>
                {
                    b.HasOne("RentingServiceBackend.Entities.ForRentMainCategory", "MainCategory")
                        .WithMany("ForRentPosts")
                        .HasForeignKey("MainCategoryId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("MainCategory");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.ForSalePost", b =>
                {
                    b.HasOne("RentingServiceBackend.Entities.ForSaleMainCategory", "MainCategory")
                        .WithMany("ForSalePosts")
                        .HasForeignKey("MainCategoryId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("MainCategory");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.User", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("OwnedPosts");

                    b.Navigation("Reservations");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.ForRentMainCategory", b =>
                {
                    b.Navigation("ForRentPosts");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.ForSaleMainCategory", b =>
                {
                    b.Navigation("ForSalePosts");
                });

            modelBuilder.Entity("RentingServiceBackend.Entities.ForRentPost", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Reservations");
                });
#pragma warning restore 612, 618
        }
    }
}
