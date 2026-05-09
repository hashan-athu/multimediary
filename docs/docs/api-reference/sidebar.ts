import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api-reference/multimediary-api",
    },
    {
      type: "category",
      label: "Auth",
      items: [
        {
          type: "doc",
          id: "api-reference/admin-login",
          label: "Admin login",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/admin-logout",
          label: "Admin logout",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api-reference/reset-all-sessions",
          label: "Reset all sessions",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Movies",
      items: [
        {
          type: "doc",
          id: "api-reference/list-movies",
          label: "List movies",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-a-movie-manual",
          label: "Create a movie (manual)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-movie-detail",
          label: "Get movie detail",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-movie",
          label: "Update a movie",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-movie",
          label: "Delete a movie",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "api-reference/search-tm-db-by-title",
          label: "Search TMDb by title",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/import-a-movie-from-tm-db",
          label: "Import a movie from TMDb",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Ratings",
      items: [
        {
          type: "doc",
          id: "api-reference/list-ratings-for-a-movie",
          label: "List ratings for a movie",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/add-a-rating-to-a-movie",
          label: "Add a rating to a movie",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/update-a-rating",
          label: "Update a rating",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-rating",
          label: "Delete a rating",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Actors",
      items: [
        {
          type: "doc",
          id: "api-reference/list-actors",
          label: "List actors",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-an-actor",
          label: "Create an actor",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-an-actor",
          label: "Get an actor",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-an-actor",
          label: "Update an actor",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-an-actor",
          label: "Delete an actor",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Directors",
      items: [
        {
          type: "doc",
          id: "api-reference/list-directors",
          label: "List directors",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-a-director",
          label: "Create a director",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-a-director",
          label: "Get a director",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-director",
          label: "Update a director",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-director",
          label: "Delete a director",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Disks",
      items: [
        {
          type: "doc",
          id: "api-reference/list-disks",
          label: "List disks",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-a-disk",
          label: "Create a disk",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-disk-detail-includes-all-movies-on-this-disk",
          label: "Get disk detail (includes all movies on this disk)",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-disk",
          label: "Update a disk",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-disk",
          label: "Delete a disk",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Disk Formats",
      items: [
        {
          type: "doc",
          id: "api-reference/list-disk-formats",
          label: "List disk formats",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-a-disk-format",
          label: "Create a disk format",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-a-disk-format",
          label: "Get a disk format",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-disk-format",
          label: "Update a disk format",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-disk-format",
          label: "Delete a disk format",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Genres",
      items: [
        {
          type: "doc",
          id: "api-reference/list-genres",
          label: "List genres",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-a-genre",
          label: "Create a genre",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-a-genre",
          label: "Get a genre",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-genre",
          label: "Update a genre",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-genre",
          label: "Delete a genre",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Categories",
      items: [
        {
          type: "doc",
          id: "api-reference/list-categories",
          label: "List categories",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-a-category",
          label: "Create a category",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-a-category",
          label: "Get a category",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-category",
          label: "Update a category",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-category",
          label: "Delete a category",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Qualities",
      items: [
        {
          type: "doc",
          id: "api-reference/list-qualities",
          label: "List qualities",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-a-quality",
          label: "Create a quality",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-a-quality",
          label: "Get a quality",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-quality",
          label: "Update a quality",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-quality",
          label: "Delete a quality",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Reviewers",
      items: [
        {
          type: "doc",
          id: "api-reference/list-reviewers",
          label: "List reviewers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-a-reviewer",
          label: "Create a reviewer",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-a-reviewer",
          label: "Get a reviewer",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-reviewer",
          label: "Update a reviewer",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-reviewer",
          label: "Delete a reviewer",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Users",
      items: [
        {
          type: "doc",
          id: "api-reference/list-admin-users",
          label: "List admin users",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/create-an-admin-user",
          label: "Create an admin user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/get-a-user",
          label: "Get a user",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/update-a-users-role",
          label: "Update a user's role",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "api-reference/delete-a-user",
          label: "Delete a user",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Dashboard",
      items: [
        {
          type: "doc",
          id: "api-reference/admin-dashboard-stats",
          label: "Admin dashboard stats",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Public",
      items: [
        {
          type: "doc",
          id: "api-reference/get-a-public-session-token-placeholder",
          label: "Get a public session token (placeholder)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "api-reference/list-movies-public-no-auth-required",
          label: "List movies (public, no auth required)",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "api-reference/get-movie-detail-public-no-auth-required",
          label: "Get movie detail (public, no auth required)",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Health",
      items: [
        {
          type: "doc",
          id: "api-reference/health-check",
          label: "Health check",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
