class ProjectUsersController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:destroy]

  def create
    puts "*********** ADDING USER TO PROJECT"
    user = User.find_by_email(params[:user][:email])
    
    @project = Project.find_by_id(params[:project_id])
    puts "got project: " + @project.inspect

    if user.nil?
      puts "*********** user did not exist, checking for invitee"
      invitee = Invitee.find_by_email(params[:user][:email])
      if invitee.nil?
        puts "*********** creating invitee"
        invitee = Invitee.new(:email => params[:user][:email])
        invitee.save
        puts "*********** created invitee"
      end
      @project_user = ProjectUser.find_by_project_id_and_invitee_id(@project.id, invitee.id)
    else
      puts "*********** user already existed"
      @project_user = ProjectUser.find_by_project_id_and_user_id(@project.id, user.id)
    end
    
    puts "got project user" + @project_user.inspect

    puts "roles???  " + ProjectUser::ROLES.map{|role| role[0].to_s}.inspect

    if @project_user.nil?
      puts "*********** CREATING PROJECT USER"
      if user.nil?
        @project_user = ProjectUser.new(:project_id => @project.id, :invitee_id => invitee.id, :role=> "view")
      else
        @project_user = ProjectUser.new(:project_id => @project.id, :user_id => user.id, :role=> "view")
      end
      @project_user.save!
    else
      puts "*********** USER ALREADY IN PROJECT"
    end
    
    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def update
    puts "***********changing: " + params.inspect 
    @project = Project.find(params[:project_id])
    @project_user = @project.project_users.find(params[:id])

    puts "*********** setting role to " + params[:role]
    @project_user.role = params[:role]
    @project_user.save
    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end

  def destroy
    puts "***********removing: " + params.inspect 
    @project = Project.find(params[:project_id])
    @project_user = @project.project_users.find(params[:id])
    @project_user.destroy
    respond_to do |format|
      format.html { render :nothing => true }
      format.js 
    end
  end
end
