class CreateExercises < ActiveRecord::Migration[5.1]
  def change
    create_table :exercises do |t|
      t.integer :topic_id
      t.string :text

      t.timestamps
    end
  end
end
