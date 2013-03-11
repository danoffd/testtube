class Story < ActiveRecord::Base
  attr_accessible :points, :title

  validates :title, :presence => true
  validates :title, :length => {:minimum => 5}
  validates :title, :uniqueness => {:message => "must be unique"}
end
