class Topic < ApplicationRecord
  belongs_to :course
  has_many :requirements
  has_many :exercises
end
