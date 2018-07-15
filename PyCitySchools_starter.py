
# coding: utf-8

# # PyCity Schools Analysis
# 
# * As a whole, schools with higher budgets, did not yield better test results. By contrast, schools with higher spending per student actually (\$645-675) underperformed compared to schools with smaller budgets (<\$585 per student).
# 
# * As a whole, smaller and medium sized schools dramatically out-performed large sized schools on passing math performances (89-91% passing vs 67%).
# 
# * As a whole, charter schools out-performed the public district schools across all metrics. However, more analysis will be required to glean if the effect is due to school practices or the fact that charter schools tend to serve smaller student populations per school. 
# ---

# ### Note
# * Instructions have been included for each segment. You do not have to follow them exactly, but they are included to help you think through the steps.

# In[6]:


# Dependencies and Setup
import pandas as pd
import numpy as np

# File to Load (Remember to Change These)
school_data_to_load = "Resources/schools_complete.csv"
student_data_to_load = "Resources/students_complete.csv"

# Read School and Student Data File and store into Pandas Data Frames
school_data = pd.read_csv(school_data_to_load)
student_data = pd.read_csv(student_data_to_load)

# Combine the data into a single dataset
school_data_complete = pd.merge(student_data, school_data, how="left", on=["school_name", "school_name"])
df = school_data_complete
df.head()


# ## District Summary
# 
# * Calculate the total number of schools
# 
# * Calculate the total number of students
# 
# * Calculate the total budget
# 
# * Calculate the average math score 
# 
# * Calculate the average reading score
# 
# * Calculate the overall passing rate (overall average score), i.e. (avg. math score + avg. reading score)/2
# 
# * Calculate the percentage of students with a passing math score (70 or greater)
# 
# * Calculate the percentage of students with a passing reading score (70 or greater)
# 
# * Create a dataframe to hold the above results
# 
# * Optional: give the displayed data cleaner formatting

# In[45]:


#total num schools
schools = df['school_name'].unique()
num_schools = len(schools)

#total num stu
students = df['student_name'].unique()
num_stu = len(students)

#total budget
schools_df = df.groupby('school_name').mean()
budg = schools_df['budget'].sum()

#group by student
new_df = df.groupby('student_name').mean()

#avg math
math_mean = new_df['math_score'].mean()

#avg reading
reading_mean = new_df['reading_score'].mean()

#passign rate (based on overall avg)
overall_mean = (math_mean + reading_mean)/2

#per of stu w passing math
new_df
bool_df = new_df['math_score'] >= 70
passing_math_df = new_df.loc[bool_df]
total_stu = len(new_df)
stu_passing_math = len(passing_math_df)

per_math_pass = stu_passing_math / total_stu

#per of stu w passing reading
bool2_df = new_df['reading_score'] >= 70
passing_reading_df = new_df.loc[bool2_df]
stu_passign_reaing = len(passing_reading_df)

per_reading_pass = stu_passign_reaing / total_stu

#store in df
dictionary = {
    'number of schools': num_schools,
    'number of students': num_stu,
    'total budget': budg,
    'average math': math_mean,
    'average reading': reading_mean,
    'average overall': overall_mean,
    'percent of students passing math': per_math_pass,
    'percent of students passing reading': per_reading_pass
}

data = pd.DataFrame.from_dict(dictionary, orient='index')


# ## School Summary

# * Create an overview table that summarizes key metrics about each school, including:
#   * School Name
#   * School Type
#   * Total Students
#   * Total School Budget
#   * Per Student Budget
#   * Average Math Score
#   * Average Reading Score
#   * % Passing Math
#   * % Passing Reading
#   * Overall Passing Rate (Average of the above two)
#   
# * Create a dataframe to hold the above results

# ## Top Performing Schools (By Passing Rate)

# * Sort and display the top five schools in overall passing rate

# In[142]:


out_df = pd.DataFrame()

#Total Students
out_df['students'] = df['school_name'].value_counts()

#Total School Budget
out_df['budget'] = df['budget'].unique()

#School Name
out_df['school name'] = df['school_name'].unique()

#School Type
district = df.loc[df["type"] == "District"]
array_dist = district['school_name'].unique()
array_type = []
for schoo in df['school_name'].unique():
    if schoo not in array_dist:
        array_type.append('charter')
    else:
        array_type.append('district')
out_df['type'] = array_type

#Per Student Budget

out_df['per student budget'] = out_df['budget'] / out_df['students']

#Average Math Score #Average Reading Score
gbgb = df.groupby('school_name')
_df = gbgb.mean()
_df

out_df['avg math'] = _df['math_score']
out_df['avg reading'] = _df['reading_score']

out_df

#% Passing Math
#% Passing Reading
#Overall Passing Rate (Average of the above two)


# ## Bottom Performing Schools (By Passing Rate)

# * Sort and display the five worst-performing schools

# In[14]:





# ## Math Scores by Grade

# * Create a table that lists the average Reading Score for students of each grade level (9th, 10th, 11th, 12th) at each school.
# 
#   * Create a pandas series for each grade. Hint: use a conditional statement.
#   
#   * Group each series by school
#   
#   * Combine the series into a dataframe
#   
#   * Optional: give the displayed data cleaner formatting

# In[15]:





# ## Reading Score by Grade 

# * Perform the same operations as above for reading scores

# In[16]:





# ## Scores by School Spending

# * Create a table that breaks down school performances based on average Spending Ranges (Per Student). Use 4 reasonable bins to group school spending. Include in the table each of the following:
#   * Average Math Score
#   * Average Reading Score
#   * % Passing Math
#   * % Passing Reading
#   * Overall Passing Rate (Average of the above two)

# In[17]:


# Sample bins. Feel free to create your own bins.
spending_bins = [0, 585, 615, 645, 675]
group_names = ["<$585", "$585-615", "$615-645", "$645-675"]


# In[18]:





# ## Scores by School Size

# * Perform the same operations as above, based on school size.

# In[144]:


# Sample bins. Feel free to create your own bins.
size_bins = [0, 1000, 2000, 5000]
group_names = ["Small (<1000)", "Medium (1000-2000)", "Large (2000-5000)"]


# In[145]:


out_df["school size"] = pd.cut(out_df["students"], size_bins, labels=group_names)
out_df


# ## Scores by School Type

# * Perform the same operations as above, based on school type.

# In[20]:




