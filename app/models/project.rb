class Project < ActiveRecord::Base
  attr_accessible :description, :name

  has_many :actors, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :project_models, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :story_types, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :user_stories, :dependent => :destroy, :foreign_key => 'project_id'

  validates :name, :uniqueness => {:message => "name must be unique"}
end
