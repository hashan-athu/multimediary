class AddActiveTokenToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :active_token, :text
  end
end
