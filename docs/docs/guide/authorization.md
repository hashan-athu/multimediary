---
sidebar_position: 6
---

# Authorization

Authorization is handled by **CanCanCan** via `app/models/ability.rb`.
Every admin user has one of four roles assigned at creation (default: `editor`).

## Roles

| Role | Description |
|---|---|
| `super_admin` | Full access to everything including user management and session reset |
| `admin` | Manage all content and lookup tables; can read users but not destroy them |
| `editor` | Manage all content; **cannot destroy** lookup tables (Genre, Category, Quality, DiskFormat, Reviewer, Disk) |
| `analyst` | Read-only access to all content and the dashboard |

## Permission matrix

| Action | super_admin | admin | editor | analyst |
|---|:---:|:---:|:---:|:---:|
| Create / update / delete movies | ✅ | ✅ | ✅ | ❌ |
| Destroy genres / categories / qualities | ✅ | ✅ | ❌ | ❌ |
| Destroy disks / disk formats / reviewers | ✅ | ✅ | ❌ | ❌ |
| View user list | ✅ | ✅ | ❌ | ❌ |
| Create users | ✅ | ❌ | ❌ | ❌ |
| Change user roles | ✅ | ❌ | ❌ | ❌ |
| Destroy users | ✅ | ❌ | ❌ | ❌ |
| Session reset_all | ✅ | ❌ | ❌ | ❌ |
| View dashboard | ✅ | ✅ | ✅ | ✅ |

## Destroy guards

In addition to role checks, certain records cannot be deleted if dependent
records exist regardless of role:

| Record | Blocked when |
|---|---|
| `Genre` | Has associated movies |
| `Category` | Has associated movies |
| `Quality` | Has associated movies |
| `DiskFormat` | Has associated disks |
| `Disk` | Has associated movies |

These checks are enforced in controller `before_action` hooks and return
`422 Unprocessable Entity` with an explanatory error message.

## Error responses

**Forbidden (wrong role):**
```json
HTTP 403 Forbidden
{
  "error": "Forbidden",
  "message": "You are not authorized to perform this action."
}
```

**Destroy guard (has dependent records):**
```json
HTTP 422 Unprocessable Entity
{
  "error": "Cannot delete genre: it has associated movies"
}
```
