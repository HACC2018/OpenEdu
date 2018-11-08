class User < ApplicationRecord
  has_secure_password
  has_many :completions
  has_many :reviews
end
