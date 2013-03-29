class Project < ActiveRecord::Base
  attr_accessible :description, :name, :is_public

  has_many :actors, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :project_models, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :story_types, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :user_stories, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :project_users, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :users, :through => :project_users

  validates :name, :uniqueness => {:message => "name must be unique"}
end
