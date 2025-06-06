﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Study.Data;

#nullable disable

namespace Study.Data.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20250602225527_Message")]
    partial class Message
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Study.Core.Entities.Folder", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .HasColumnType("longtext");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.Property<int?>("ParentFolderId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.HasIndex("ParentFolderId");

                    b.ToTable("Folders");
                });

            modelBuilder.Entity("Study.Core.Entities.Lesson", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<string>("FileType")
                        .HasColumnType("longtext");

                    b.Property<int?>("FolderId")
                        .HasColumnType("int");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("LessonName")
                        .HasColumnType("longtext");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("UrlName")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("FolderId");

                    b.HasIndex("OwnerId");

                    b.ToTable("Lessons");
                });

            modelBuilder.Entity("Study.Core.Entities.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("IsRead")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("Study.Core.Entities.Role", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<string>("RoleName")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("Study.Core.Entities.SharedLesson", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("AccessRequestToken")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("EmailVerificationCode")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("EmailVerificationExpiry")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("FailedVerificationAttempts")
                        .HasColumnType("int");

                    b.Property<bool>("IsApproved")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("IsPublic")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("LessonId")
                        .HasColumnType("int");

                    b.Property<DateTime>("SharedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("SharedWithEmail")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("LessonId");

                    b.ToTable("SharedLessons");
                });

            modelBuilder.Entity("Study.Core.Entities.Transcript", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("CreatedBy")
                        .HasColumnType("int");

                    b.Property<int>("LessonId")
                        .HasColumnType("int");

                    b.Property<string>("TranscriptUrl")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("UpdateBy")
                        .HasColumnType("int");

                    b.Property<string>("UserName")
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("LessonId")
                        .IsUnique();

                    b.ToTable("Transcripts");
                });

            modelBuilder.Entity("Study.Core.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("CreatedBy")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .HasColumnType("longtext");

                    b.Property<string>("FirstName")
                        .HasColumnType("longtext");

                    b.Property<string>("LastName")
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .HasColumnType("longtext");

                    b.Property<int>("PasswordHash")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdateAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("UpdateBy")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Study.Core.Entities.UserRole", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("RoleId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.HasIndex("UserId");

                    b.ToTable("UserRoles");
                });

            modelBuilder.Entity("Study.Core.Entities.Folder", b =>
                {
                    b.HasOne("Study.Core.Entities.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Study.Core.Entities.Folder", "ParentFolder")
                        .WithMany()
                        .HasForeignKey("ParentFolderId");

                    b.Navigation("Owner");

                    b.Navigation("ParentFolder");
                });

            modelBuilder.Entity("Study.Core.Entities.Lesson", b =>
                {
                    b.HasOne("Study.Core.Entities.Folder", "Folder")
                        .WithMany()
                        .HasForeignKey("FolderId");

                    b.HasOne("Study.Core.Entities.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Folder");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("Study.Core.Entities.Message", b =>
                {
                    b.HasOne("Study.Core.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Study.Core.Entities.SharedLesson", b =>
                {
                    b.HasOne("Study.Core.Entities.Lesson", "Lesson")
                        .WithMany()
                        .HasForeignKey("LessonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Lesson");
                });

            modelBuilder.Entity("Study.Core.Entities.Transcript", b =>
                {
                    b.HasOne("Study.Core.Entities.Lesson", "Lessom")
                        .WithOne("Transcript")
                        .HasForeignKey("Study.Core.Entities.Transcript", "LessonId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Lessom");
                });

            modelBuilder.Entity("Study.Core.Entities.UserRole", b =>
                {
                    b.HasOne("Study.Core.Entities.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Study.Core.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Study.Core.Entities.Lesson", b =>
                {
                    b.Navigation("Transcript");
                });
#pragma warning restore 612, 618
        }
    }
}
