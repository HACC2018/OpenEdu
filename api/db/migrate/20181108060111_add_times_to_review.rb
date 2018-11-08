class AddTimesToReview < ActiveRecord::Migration[5.1]
  def change
    add_column :reviews, :times, :integer
  end
end
