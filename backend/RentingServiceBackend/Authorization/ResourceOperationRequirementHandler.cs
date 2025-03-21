﻿using Microsoft.AspNetCore.Authorization;
using RentingServiceBackend.Entities;
using System.Security.Claims;

namespace RentingServiceBackend.Authorization
{
    public class ResourceOperationRequirementHandler : AuthorizationHandler<ResourceOperationRequirement, Post>
    {
        protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, ResourceOperationRequirement requirement, Post post)
        {
            if (requirement.ResourceOperation == ResourceOperation.Create || requirement.ResourceOperation == ResourceOperation.Read)
            {
                context.Succeed(requirement);
            }
            var userId = context.User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier).Value;

            if (post.UserId == int.Parse(userId))
            {
                context.Succeed(requirement);
            }
        }
    }
}
