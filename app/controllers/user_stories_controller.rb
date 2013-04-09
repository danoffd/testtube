class UserStoriesController < ApplicationController
  load_and_authorize_resource :project
  load_and_authorize_resource :user_story, :through => :project, :shallow => true

  # before_filter :find_project

  def show
  end
  
  def new
    # need the list of actors to include in the story
    # editor combo box
    @all_actors = get_actors

    @user_story = @project.user_stories.new
    puts "*************creating new form: " + params.inspect
    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def destroy

    @user_story_id = @user_story.id
    @user_story.delete

    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def edit
    # need the list of actors to include in the story
    # editor combo box
    @all_actors = get_actors

    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def index
    # identify which drawers should be in the chest
    @slider_drawers = build_drawers

    # need the list of actors to include in the story
    # editor combo box
    @all_actors = get_actors


    # fetch the root user stories from the DB that are the roots
    # They will contain the rest of the stories recursively
    @root_user_stories = get_root_user_stories

    @user_story = @project.user_stories.new

    puts "***********new user story: " + @user_story.inspect
  end

  def update
    puts "++++++ in update: " + params.inspect
    story_type = StoryType.where(:story_type_name => "Development").first

    puts "++++++ gonna save: " + params[:user_story][:want_to]
    puts params.inspect

    @user_story = UserStory.find(params[:user_story][:id])
    @user_story.want_to = params[:user_story][:want_to]
    @user_story.so_i_can = params[:user_story][:so_i_can]
    @user_story.is_estimate_final = false
    @user_story.actor = find_or_create_actor(params[:user_story][:actor_name])
   
    puts @user_story.inspect

    @user_story.save!

    puts "++++++ saved"

    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def create
    puts "++++++ in create"
    story_type = StoryType.where(:story_type_name => "Development").first
    puts "++++++ gonna save: " + params.inspect
   
    @user_story = @project.user_stories.new(params[:user_story])
    @user_story.priority = 5
    @user_story.story_type = story_type
    @user_story.is_fully_recorded = false
    @user_story.is_estimate_final = false
    @user_story.actor = find_or_create_actor(params[:user_story][:actor_name])
   
    puts @user_story.inspect

    @user_story.save!

    puts "++++++ saved"

    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def find_or_create_actor(actor_name)
    actor = Actor.where(:actor_singular_name => actor_name, :project_id => @project.id).first
    if actor.nil?
      actor = @project.actors.create!(\
        :actor_singular_name => actor_name, \
        :actor_plural_name => actor_name.pluralize(2), \
        :use_an_instead_of_a => false)
    end
    puts "++++++ Actor:" + actor.inspect
    actor
  end

  def get_root_user_stories
    UserStory.where("parent_user_story_id is NULL and project_id = ?", @project.id)
  end

  def build_drawers
    retval = []

    retval.push({\
      :partial_name => "drawer_filters"\
      , :drawer_header => "Filters"\
      , :handle_text => "filters"\
    })

    retval.push({\
      :partial_name => "drawer_assign_to_buckets"\
      , :drawer_header => "Work Buckets"\
      , :handle_text => "buckets"\
    })

    retval.push({\
      :partial_name => "drawer_cheat_sheet"\
      , :drawer_header => "Cheat Sheet"\
      , :handle_text => "cheat"\
    })

    return retval
  end

  def get_actors
    if @project.nil?
      @project = Project.find(@user_story.project_id)
    end
    @project.actors
  end

end
