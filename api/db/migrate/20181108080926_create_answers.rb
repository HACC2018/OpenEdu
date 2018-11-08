class CreateAnswers < ActiveRecord::Migration[5.1]
  def change
    create_table :answers do |t|
      t.integer :exercise_id
      t.string :text
      t.boolean :is_correct

      t.timestamps
    end
  end
end
