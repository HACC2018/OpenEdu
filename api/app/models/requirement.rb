class Requirement < ApplicationRecord
  belongs_to :topic
  belongs_to :required_topic, :class_name => "Topic"
end
