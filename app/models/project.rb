class Project < ActiveRecord::Base
  attr_accessible :description, :name, :is_public

  has_many :actors, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :project_models, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :story_types, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :user_stories, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :project_users, :dependent => :destroy, :foreign_key => 'project_id'
  has_many :users, :through => :project_users

  validates :name, :uniqueness => {:message => "name must be unique"}
  
  # scope :mine, joins(:project_users).where('project_users.user_id = ?', (@user ||= User.new).id)
  scope :view, (lambda do |user_id|
    user_id = (user_id.nil?) ? "-1" : user_id.to_s
     where("is_public = true or exists (select 1 from project_users where projects.id = project_users.project_id and project_users.user_id = ?)", user_id)
   end)

  scope :admin, (lambda do |user_id|
    user_id = (user_id.nil?) ? "-1" : user_id.to_s
     puts "***********SCOPE :mine '" + user_id + "'"
     where("is_public = true or exists (select 1 from project_users where projects.id = project_users.project_id and project_users.user_id = ? and project_users.role = 'admin')", user_id)
   end)

  def view?(user)
     project_users.any?{|project_user| project_user.user == user}
  end

  def admin?(user)
     project_users.any?{|project_user| project_user.user == user && project_user.role == "admin"}
  end
end
