class CreateUserProjects < ActiveRecord::Migration[5.2]
  def change
    create_table :user_projects do |t|
      t.belongs_to :project, foreign_key: true
      t.belongs_to :user

      t.timestamps
    end
  end
end
