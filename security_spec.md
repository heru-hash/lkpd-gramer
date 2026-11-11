# Security Specification: Grammar Challenge X SMK

## Data Invariants
1. **User Identity & Role Integrity**:
   - Only admins can change user roles (`admin`, `guru`, `siswa`).
   - Normal users can update only their own profile details (`nama`, `kelas`, `jurusan`, `photoURL`, `nis`, `nip`).
   - The user's UID must strictly match `request.auth.uid`.

2. **Scores & Performance Logs**:
   - Siswa can only create a score log where `incoming().uid == request.auth.uid`.
   - Scores cannot be overwritten arbitrarily by other students.
   - Teachers and Admins can read all scores for grading, analytics, and reporting.

3. **Questions & Materials Bank**:
   - Guru and Admin can create, edit, or delete questions and materials.
   - Siswa can read all questions and materials to participate in games and study.

4. **Team Battle & Interactive Session**:
   - Guru and Admin can initiate and control active battle sessions.
   - All authenticated users can read real-time battle state and submit team points within bounds.

5. **Leaderboard**:
   - Leaderboard entries can only be updated for the authenticated user, or by Guru/Admin.

## The Dirty Dozen Security Test Payloads
1. **Payload 1 (Privilege Escalation)**: Student updating their own role from `siswa` to `admin`.
2. **Payload 2 (Ghost Field Injection)**: Creating a question with unauthorized administrative flags.
3. **Payload 3 (Score Forgery)**: Submitting a score document with `uid` belonging to another student.
4. **Payload 4 (Identity Impersonation)**: Updating another user's profile without ownership.
5. **Payload 5 (Oversized Payload Bomb)**: Writing question text > 500 characters or malicious script tags.
6. **Payload 6 (Material Deletion)**: Student attempting to delete a grammar module.
7. **Payload 7 (Unauthenticated Read)**: Anonymous client trying to list student names and scores.
8. **Payload 8 (Invalid ID Injection)**: Document ID containing path traversal `../admin/hack`.
9. **Payload 9 (Score Negative Mutation)**: Maliciously injecting NaN or extreme negative numbers.
10. **Payload 10 (Classroom Tampering)**: Student attempting to delete a class roster.
11. **Payload 11 (Battle Hijack)**: Student attempting to terminate an active classroom IFP session.
12. **Payload 12 (Leaderboard Spoofing)**: Submitting fabricated top 1 rank with 9999999 points for another user.
