class RenameRequiredTopic < ActiveRecord::Migration[5.1]
  def change
    rename_column :requirements, :required_topic, :required_topic_id
  end
end
