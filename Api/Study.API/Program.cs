using Amazon.Extensions.NETCore.Setup;
using Amazon.S3;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Study.API;
using Study.Core;
using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using Study.Core.Interface.InterfaceRepository;
using Study.Data;
using Study.Data.Repository;
using Study.Service;
using Study.Services;
using System.Text;
using OpenAI;
using OpenAI.Managers;
using Microsoft.AspNetCore.SignalR;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
Env.Load();
var builder = WebApplication.CreateBuilder(args);


// רישום שירותי Business
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ILessonService, LessonService>();
builder.Services.AddScoped<ITranscriptService, TranscriptService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IFolderService, FolderService>();
builder.Services.AddScoped<IStatsticsService, StatsticsService>();

// רישום שירותי Repository
builder.Services.AddScoped<IRepository<User>, UserRepository>();
builder.Services.AddScoped<IRepository<Lesson>, LessonRepository>();
builder.Services.AddScoped<IRepository<Transcript>, TranscriptRepository>();
builder.Services.AddScoped<IRepository<Folder>, FolderRepository>();
builder.Services.AddScoped<IRepository<UserRole>, UserRoleRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILessonRepository, LessonRepository>();
builder.Services.AddScoped<IFolderRepository, FolderRepository>();
builder.Services.AddScoped<ITranscriptRepository, TranscriptRepository>();

builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IReposiroryManager, RepositoryManager>();

builder.Services.AddScoped<AuthService>();
builder.Services.AddSignalR();
builder.Services.AddScoped<TranscriptionSe>();


// רישום שירות OpenAI כשירות Singleton
builder.Services.AddSingleton<OpenAIService>(sp => new OpenAIService(new OpenAiOptions
{
    ApiKey = builder.Configuration["OpenAI:ApiKey"]
}));
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

//builder.Services.AddScoped<AuthService>();
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddSingleton<IAmazonS3>(serviceProvider =>
{
    var options = serviceProvider.GetRequiredService<IOptions<AWSOptions>>().Value;

    // הגדרת Credentials באופן ידני
    var credentials = new Amazon.Runtime.BasicAWSCredentials(
        builder.Configuration["AWS_ACCESS_KEY_ID"],
        builder.Configuration["AWS_SECRET_ACCESS_KEY"]
    );

    // הגדרת Region
    var region = Amazon.RegionEndpoint.GetBySystemName(builder.Configuration["AWS_REGION"]);


    return new AmazonS3Client(credentials, region);
});


builder.Services.AddAutoMapper(typeof(MappingProfile), typeof(MappingProfilePost));

// הגדרת Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});
// הגדרת Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));
    options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:5173" +
        "", "http://localhost:4200", "https://studystream-rgv5.onrender.com") // או ה־frontend שלך
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials()
    );
});
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll", policy =>
//                policy.WithOrigins("http://localhost:5714") // החלף עם כתובת האתר שלך
//              .AllowAnyMethod()
//              .AllowAnyHeader()
//              .AllowCredentials()); // חשוב עבור SignalR!
//});




var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

//builder.Services.AddDbContext<DataContext>(option =>
//{
//    option.UseSqlServer("Data Source=DESKTOP-8ED3CL9;Initial Catalog=Study;Integrated Security=false;  Trusted_Connection = SSPI; MultipleActiveResultSets = true; TrustServerCertificate = true");
//});
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddHttpClient();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

// הפעלת CORS עם המדיניות שהגדרנו
app.UseCors("AllowFrontend");



app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();




app.MapHub<TranscriptionHub>("/transcriptionHub");



app.Run();
///rtt