class ProjectsController < ApplicationController
  load_and_authorize_resource

  def index
    @projects = [] if @projects == nil  #cancan leaves this nil if none were passed
    @dummy_project = Project.new
  end

  def destroy
    puts "***********removing: " + params.inspect 
    @project.destroy

    flash[:notice] = "Project has been purged"
    redirect_to projects_path
    
  end
  
  def show
    @new_user = User.new
    @dummy_pu = ProjectUser.new
  end

  def create
    puts "save me:  " +  params[:project][:id]

    puts "creating project"
    @project = Project.new(params[:project])
  
    @project.save!

    projectUser = @project.project_users.create( \
      :user_id => current_user.id, \
      :role => "admin")

    actorUser = @project.actors.create( \
      :actor_singular_name => "User", \
      :actor_plural_name => "Users", \
      :use_an_instead_of_a =>false)

    storyType = @project.story_types.create(:story_type_name => "Basic Task")

    firstStory = @project.user_stories.create( \
        :actor_id => actorUser.id, \
        :story_type_id => storyType.id, \
        :want_to => "start a project with an initial dummy story", \
        :so_i_can => "change it to be what I want it to be", \
        :priority => 1, \
        :is_fully_recorded => false, \
        :stack_rank => 0, \
        :is_estimate_final => false)

    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
    
  end

  def update
    puts "************ saving project" + params.inspect 
    # @project = Project.find(params[:id])
    puts "************ project:" + @project.inspect 
    # @project.notes_attributes = params[:user_story][:notes_attributes]

    @project.update_attributes!(params[:project])
    puts "************ done!" 
    render :nothing => true
  end
end
