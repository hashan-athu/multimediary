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
      can :read, :dashboard
      can :read, User
      cannot :destroy, User
      can :create, :upload

    when "editor"
      can :manage, [ Movie, Actor, Director, Genre, Category, Quality,
                     Disk, DiskFormat, Reviewer, Rating ]
      can :read, :dashboard
      cannot :destroy, [ Disk, DiskFormat, Category, Genre, Quality, Reviewer ]
      can :create, :upload

    when "analyst"
      can :read, [ Movie, Actor, Director, Genre, Category, Quality,
                   Disk, DiskFormat, Reviewer, Rating ]
      can :read, :dashboard
    end
  end
end
