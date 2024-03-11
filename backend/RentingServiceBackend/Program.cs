using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RentingServiceBackend.ServiceSettings;
using RentingServiceBackend.Entities;
using FluentValidation.AspNetCore;
using RentingServiceBackend;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Memory;
using System;
using NLog.Web;
using RentingServiceBackend.Authorization;
using RentingServiceBackend.Middlewares;
using RentingServiceBackend.Services;
using RentingServiceBackend.Models;
using RentingServiceBackend.Models.Validators;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.SetMinimumLevel(Microsoft.Extensions.Logging.LogLevel.Trace);
builder.Host.UseNLog();

var authenticationSetting = new AuthenticationSettings();
var emailSenderSetting = new EmailSenderSettings();
builder.Configuration.GetSection("Authentication").Bind(authenticationSetting);
builder.Configuration.GetSection("EmailSender").Bind(emailSenderSetting);
builder.Services.AddSingleton(authenticationSetting);
builder.Services.AddSingleton(emailSenderSetting);
builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = "Bearer";
    option.DefaultScheme = "Bearer";
    option.DefaultChallengeScheme = "Bearer";
}).AddJwtBearer(cfg =>
{
    cfg.RequireHttpsMetadata = false;
    cfg.SaveToken = true;
    cfg.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = authenticationSetting.JwtIssuer,
        ValidAudience = authenticationSetting.JwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationSetting.JwtKey)),
    };
});

builder.Services.AddScoped<IAuthorizationHandler, ResourceOperationRequirementHandler>();
builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly());

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers().AddFluentValidation();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("appDb")));

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<RentApiSeeder>();

builder.Services.AddScoped<IValidator<RegisterUserDto>, RegisterUserDtoValidator>();
builder.Services.AddScoped<IValidator<LoginUserDto>, LoginUserDtoValidator>();
builder.Services.AddScoped<IValidator<CreatePostDto>, CreatePostDtoValidator>();
builder.Services.AddScoped<IValidator<ResetPasswordDto>, ResetPasswordDtoValidator>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddTransient<IEmailSenderService, EmailSenderService>();
builder.Services.AddScoped<IUserContextService, UserContextService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<ErrorHandlingMiddleware>();

builder.Services.AddCors((options) =>
{
    //options.AddPolicy("FrontEndClient", (policyBuilder) =>
    //{
    //    policyBuilder
    //    .AllowAnyMethod()
    //    .AllowAnyHeader()
    //    .AllowCredentials()
    //    .WithOrigins(builder.Configuration["AllowedOrigins"]);
    //});
    options.AddPolicy("FrontEndClientMobile", (policyBuilder) =>
    {
        policyBuilder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
        //.WithOrigins(builder.Configuration["AllowedOriginsMobile"]);
    });
});

var app = builder.Build();

var scope = app.Services.CreateScope();
var seeder = scope.ServiceProvider.GetRequiredService<RentApiSeeder>();
seeder.Seed();

app.UseHttpsRedirection();
app.UseRouting();

app.UseCors("FrontEndClientMobile");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ErrorHandlingMiddleware>();

app.MapControllers();

app.Run();
