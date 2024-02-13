using Azure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace RentingServiceBackend.Entities
{
    public class AppDbContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<PostCategoryLinkEnitity> PostCategory { get; set; }
        public DbSet<PostFeatureLinkEntity> PostFeature { get; set; }
        public DbSet<PostUserFollowLinkEntity> PostUser { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
                .HasKey(x => x.CategoryId);
            modelBuilder.Entity<Category>()
                .Property(x => x.CategoryName)
                .IsRequired()
                .HasMaxLength(25);
            modelBuilder.Entity<Category>()
                .HasMany(x => x.Posts)
                .WithMany(x => x.Categories)
                .UsingEntity<PostCategoryLinkEnitity>(l => l.HasOne<Post>().WithMany().HasForeignKey(y => y.PostId).OnDelete(DeleteBehavior.Cascade),
                r => r.HasOne<Category>().WithMany().HasForeignKey(y => y.CategoryId).OnDelete(DeleteBehavior.Cascade));

            modelBuilder.Entity<Comment>()
                .HasKey(x => x.CommentId);
            modelBuilder.Entity<Comment>()
                .Property(x => x.CommentText)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Feature>()
                .HasKey(x => x.FeatureId);
            modelBuilder.Entity<Feature>()
                .Property(x => x.FeatureName)
                .IsRequired()
                .HasMaxLength(30);
            modelBuilder.Entity<Feature>()
                .HasMany(x => x.Posts)
                .WithMany(x => x.Features)
                .UsingEntity<PostFeatureLinkEntity>(l => l.HasOne<Post>().WithMany().HasForeignKey(y => y.PostId).OnDelete(DeleteBehavior.Cascade),
                r => r.HasOne<Feature>().WithMany().HasForeignKey(y => y.FeatureId).OnDelete(DeleteBehavior.Cascade));

            modelBuilder.Entity<Post>()
                .HasKey(x => x.PostId);
            modelBuilder.Entity<Post>()
                .Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(50);
            modelBuilder.Entity<Post>()
                .Property(x => x.Description)
                .IsRequired()
                .HasMaxLength(1000);
            modelBuilder.Entity<Post>()
                .HasOne(x => x.User)
                .WithMany(x => x.OwnedPosts)
                .HasPrincipalKey(x => x.UserId)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Post>()
                .HasMany(x => x.Comments)
                .WithOne(x => x.Post)
                .HasForeignKey(x => x.PostId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Post>()
                .HasMany(x => x.Reservations)
                .WithOne(x => x.Post)
                .HasForeignKey(x => x.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            //modelBuilder.Entity<PostCategoryLinkEnitity>()
            //    .HasKey(x => x.PostCategoryLinkId);

            //modelBuilder.Entity<PostFeatureLinkEntity>()
            //    .HasKey(x => x.PostFeatureLinkId);

            //modelBuilder.Entity<PostUserFollowLinkEntity>()
            //    .HasKey(x => x.PostUserFollowLinkId);

            modelBuilder.Entity<Reservation>()
                .HasKey(x => x.ReservationId);
            modelBuilder.Entity<Reservation>()
                .Property(x => x.ReservationFlag)
                .IsRequired();

            modelBuilder.Entity<Role>()
                .HasKey(x => x.RoleId);
            modelBuilder.Entity<Role>()
                .Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(30);

            modelBuilder.Entity<User>()
                .HasKey(x => x.UserId);
            modelBuilder.Entity<User>()
                .Property(x => x.Name)
                .IsRequired()
                .HasMaxLength(30);
            modelBuilder.Entity<User>()
                .Property(x => x.Email)
                .IsRequired()
                .HasMaxLength(30);
            modelBuilder.Entity<User>()
                .HasMany(x => x.FollowedPosts)
                .WithMany(x => x.FollowedBy)
                .UsingEntity<PostUserFollowLinkEntity>(l => l.HasOne<Post>().WithMany().HasForeignKey(y => y.PostId).OnDelete(DeleteBehavior.NoAction),
                r => r.HasOne<User>().WithMany().HasForeignKey(y => y.UserId).OnDelete(DeleteBehavior.Cascade));
            modelBuilder.Entity<User>()
                .HasMany(x => x.Comments)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<User>()
                .HasMany(x => x.Reservations)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }
    }
}
