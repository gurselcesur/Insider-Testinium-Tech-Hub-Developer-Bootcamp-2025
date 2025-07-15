$(document).ready(function() {
    $.getJSON('studentData.json', function(data) {
        $('#student-list tbody').empty();
        
        data.students.forEach(function(student) {
            const row = `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.id}</td>
                    <td>${getFacultyName(student.faculty)}</td>
                    <td>${student.gpa.toFixed(2)}</td>
                    <td><button class="delete-btn">Delete</button></td>
                </tr>
            `;
            $('#student-list tbody').append(row);
        });
    }).fail(function(error) {
        console.error('Error loading JSON data:', error);
        $('#student-list tbody').html('<tr><td colspan="4" class="no-students">Error loading data.</td></tr>');
    });

    function getFacultyName(faculty) {
        const facultyNames = {
            'engineering': 'Engineering Faculty',
            'fine-arts': 'Fine Arts Faculty',
            'business': 'Business Faculty',
            'law': 'Law Faculty'
        };
        return facultyNames[faculty] || faculty;
    }

    $('#student-form').on('submit', function(e) {
        e.preventDefault();
        
        const newStudent = {
            name: $('#student-name').val(),
            id: $('#student-id').val(),
            faculty: $('#student-faculty').val(),
            gpa: parseFloat($('#student-gpa').val())
        };

        const row = `
            <tr>
                <td>${newStudent.name}</td>
                <td>${newStudent.id}</td>
                <td>${getFacultyName(newStudent.faculty)}</td>
                <td>${newStudent.gpa.toFixed(2)}</td>
                <td><button class="delete-btn">Delete</button></td>
            </tr>
        `;
        
        $('#student-list tbody').append(row);
        
        this.reset();
    });

    $(document).on('click', '#student-list tbody tr', function(e) {
        if (!$(e.target).is('.delete-btn')) {
            $(this).toggleClass('selected').siblings().removeClass('selected');
        }
    });

    $(document).on('click', '.delete-btn', function(e) {
        e.stopPropagation();
        $(this).closest('tr').fadeOut(300, function() {
            $(this).remove();
            if ($('#student-list tbody tr').length === 0) {
                $('#student-list tbody').html('<tr><td colspan="5" class="no-students">No students added yet.</td></tr>');
            }
        });
    });
});
