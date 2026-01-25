class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :jwt_authenticatable, :rememberable, :validatable,
         jwt_revocation_strategy: JwtDenylist

         #Admin Roles
  enum :role, { super_admin: 'super_admin', admin: 'admin', editor: 'editor', analyst: 'analyst' }, prefix: false, scopes: false

  # Set a default role if none is provided
  after_initialize :set_default_role, if: :new_record?

  def set_default_role
    self.role ||= :editor
  end
end

