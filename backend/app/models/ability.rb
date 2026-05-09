# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    return unless user

    case user.role
    when "super_admin"
      can :manage, :all

    when "admin"
      can :manage, [ Movie, Actor, Director, Genre, Category, Quality,
                     Disk, DiskFormat, Reviewer, Rating ]
      can :read, User
      cannot :destroy, User

    when "editor"
      can :manage, [ Movie, Actor, Director, Genre, Category, Quality,
                     Disk, DiskFormat, Reviewer, Rating ]
      cannot :destroy, [ Disk, DiskFormat, Category, Genre, Quality, Reviewer ]

    when "analyst"
      can :read, [ Movie, Actor, Director, Genre, Category, Quality,
                   Disk, DiskFormat, Reviewer, Rating ]
    end
  end
end
